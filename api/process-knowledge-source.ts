import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import crypto from "node:crypto";

const required = (value: string | undefined, name: string) => {
  if (!value) throw new Error(`Missing ${name}`);
  return value;
};

const normalize = (value: string) => value
  .normalize("NFKC")
  .replace(/\r\n?/g, "\n")
  .replace(/[ \t]+/g, " ")
  .replace(/\n{3,}/g, "\n\n")
  .trim();

const stripHtml = (value: string) => value
  .replace(/<script[\s\S]*?<\/script>/gi, " ")
  .replace(/<style[\s\S]*?<\/style>/gi, " ")
  .replace(/<[^>]+>/g, " ")
  .replace(/&nbsp;/gi, " ")
  .replace(/&amp;/gi, "&")
  .replace(/&lt;/gi, "<")
  .replace(/&gt;/gi, ">");

const chunkText = (text: string, size = 6000, overlap = 500) => {
  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    let end = Math.min(text.length, start + size);
    if (end < text.length) {
      const paragraphBreak = text.lastIndexOf("\n\n", end);
      const sentenceBreak = text.lastIndexOf(". ", end);
      if (paragraphBreak > start + size * 0.6) end = paragraphBreak;
      else if (sentenceBreak > start + size * 0.6) end = sentenceBreak + 1;
    }
    const chunk = text.slice(start, end).trim();
    if (chunk) chunks.push(chunk);
    if (end >= text.length) break;
    start = Math.max(end - overlap, start + 1);
  }
  return chunks;
};

async function extractText(buffer: Buffer, mimeType: string, fileName: string) {
  const lowerName = fileName.toLowerCase();
  if (mimeType === "application/pdf" || lowerName.endsWith(".pdf")) {
    const pdfModule: any = await import("pdf-parse");
    const parsePdf = pdfModule.default || pdfModule;
    const parsed = await parsePdf(buffer);
    return String(parsed.text || "");
  }
  const textLike = mimeType.startsWith("text/") || /\.(md|txt|csv|json|html|htm|xml|yaml|yml|log)$/i.test(lowerName);
  if (textLike) {
    const text = buffer.toString("utf8");
    return /\.(html|htm)$/i.test(lowerName) ? stripHtml(text) : text;
  }
  throw new Error("صيغة الملف غير مدعومة للاستخراج النصي حاليًا. استخدم PDF أو DOC/TXT/Markdown/CSV/JSON/HTML.");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const url = required(process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL, "SUPABASE_URL");
    const key = required(process.env.SUPABASE_SERVICE_ROLE_KEY, "SUPABASE_SERVICE_ROLE_KEY");
    const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
    const authorization = req.headers.authorization || "";
    const accessToken = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
    if (!accessToken) return res.status(401).json({ error: "Unauthorized" });
    const authClient = db.auth as unknown as {
      getUser: (token: string) => Promise<{ data: { user: { id: string } | null } }>;
    };
    const { data: authData } = await authClient.getUser(accessToken);
    if (!authData.user) return res.status(401).json({ error: "Unauthorized" });
    const { data: adminProfile } = await db.from("profiles").select("is_admin").eq("id", authData.user.id).maybeSingle();
    if (!adminProfile?.is_admin) return res.status(403).json({ error: "Admin access required" });
    const { sourceId, fileUrl, storagePath, mimeType = "text/plain", fileName = "source", content: suppliedContent } = req.body || {};
    if (!sourceId) return res.status(400).json({ error: "sourceId is required" });

    await db.from("chatbot_knowledge_sources").update({ processing_status: "processing", processing_error: null }).eq("id", sourceId);
    const sourceUrl = fileUrl || (storagePath ? `${url}/storage/v1/object/public/murshid-assets/${storagePath}` : null);
    let buffer: Buffer;
    let rawText = String(suppliedContent || "");
    if (sourceUrl) {
      const response = await fetch(sourceUrl);
      if (!response.ok) throw new Error(`تعذر تنزيل الملف (${response.status})`);
      const arrayBuffer = await response.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
      if (buffer.byteLength > 100 * 1024 * 1024) throw new Error("حجم الملف يتجاوز 100MB");
      rawText = await extractText(buffer, mimeType, fileName);
    } else {
      buffer = Buffer.from(rawText, "utf8");
    }

    const extracted = normalize(rawText);
    if (!extracted) throw new Error("لم يتم العثور على نص قابل للقراءة داخل الملف");
    const normalized = normalize(extracted).toLowerCase();
    const chunks = chunkText(extracted);
    const hash = crypto.createHash("sha256").update(buffer).digest("hex");

    const { error: sourceError } = await db.from("chatbot_knowledge_sources").update({
      content: extracted,
      normalized_content: normalized,
      processing_status: "ready",
      processing_error: null,
      character_count: extracted.length,
      chunk_count: chunks.length,
      source_hash: hash,
      processed_at: new Date().toISOString(),
    }).eq("id", sourceId);
    if (sourceError) throw sourceError;

    await db.from("chatbot_knowledge_chunks").delete().eq("source_id", sourceId);
    const chunkRows = chunks.map((content, index) => ({
      source_id: sourceId,
      chunk_index: index,
      content,
      normalized_content: normalize(content).toLowerCase(),
      token_count: Math.max(1, Math.ceil(content.length / 4)),
      is_active: true,
    }));
    const { error: chunkError } = await db.from("chatbot_knowledge_chunks").insert(chunkRows);
    if (chunkError) throw chunkError;
    return res.status(200).json({ ok: true, sourceId, characters: extracted.length, chunks: chunks.length });
  } catch (error: any) {
    const message = error?.message || "تعذر معالجة الملف";
    if (req.body?.sourceId) {
      const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (url && key) {
        const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
        await db.from("chatbot_knowledge_sources").update({ processing_status: "failed", processing_error: message.slice(0, 500) }).eq("id", req.body.sourceId);
      }
    }
    return res.status(422).json({ error: message });
  }
}
