import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

const sourceChunk = {
  content: "مادة الفيزياء تعقد يوم الأحد الساعة التاسعة في القاعة 12.",
  normalized_content: "ماده الفيزياء تعقد يوم الاحد الساعه التاسعه في القاعه 12.",
  source_id: "source-1",
  chatbot_knowledge_sources: [{
    title: "ملف الفيزياء",
    file_name: "physics.pdf",
    file_url: "https://drive.google.com/file/d/source-1/view",
    is_active: true,
    processing_status: "ready",
  }],
};

function queryBuilder(table: string) {
  const builder: Record<string, any> = {};
  ["select", "eq", "ilike", "in", "order", "range", "maybeSingle"].forEach((method) => {
    builder[method] = () => builder;
  });
  builder.limit = async () => ({
    data: table === "chatbot_knowledge_chunks" ? [sourceChunk] : [],
    error: null,
  });
  return builder;
}

vi.mock("@/lib/supabase", () => ({
  supabase: { from: (table: string) => queryBuilder(table) },
}));

describe("AI feature integration", () => {
  const originalFetch = globalThis.fetch;
  const originalKey = process.env.OPENROUTER_API_KEY;

  beforeEach(() => {
    process.env.OPENROUTER_API_KEY = "test-key";
    vi.stubGlobal("fetch", vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
      const body = init?.body ? JSON.parse(String(init.body)) : {};
      expect(body.messages?.length).toBeGreaterThan(0);
      return new Response(JSON.stringify({
        choices: [{ message: { content: "الإجابة مبنية على المصدر المعتمد." } }],
      }), { status: 200, headers: { "Content-Type": "application/json" } });
    }));
  });

  afterEach(() => {
    vi.stubGlobal("fetch", originalFetch);
    if (originalKey === undefined) delete process.env.OPENROUTER_API_KEY;
    else process.env.OPENROUTER_API_KEY = originalKey;
    vi.resetModules();
  });

  it("returns a source-backed response from the dedicated Murshid knowledge service", async () => {
    const { performKnowledgeRAG } = await import("@/services/knowledge-ai");
    const result = await performKnowledgeRAG("ما موعد الفيزياء؟", "سامر", true);

    expect(result.success).toBe(true);
    expect(result.answer).toContain("الإجابة");
    expect(result.context?.some((item) => item.includes("الفيزياء"))).toBe(true);
    expect(result.sources).toEqual([{ title: "ملف الفيزياء", url: "https://drive.google.com/file/d/source-1/view" }]);
  });

  it("keeps the legacy chat service callable through its own module", async () => {
    const { performRAG } = await import("@/services/ai-integration");
    const result = await performRAG("ما موعد الفيزياء؟", "سامر", false);

    expect(result.success).toBe(true);
    expect(result.answer).toContain("الإجابة");
  });
});

describe("exam schedule vision endpoint contract", () => {
  const originalFetch = globalThis.fetch;
  const originalKey = process.env.OPENROUTER_API_KEY;

  function mockResponse() {
    const json = vi.fn();
    const res = {
      statusCode: 200,
      body: undefined as unknown,
      status(code: number) { this.statusCode = code; return this; },
      json(payload: unknown) { this.body = payload; json(payload); return this; },
    };
    return { res, json };
  }

  afterEach(() => {
    vi.stubGlobal("fetch", originalFetch);
    if (originalKey === undefined) delete process.env.OPENROUTER_API_KEY;
    else process.env.OPENROUTER_API_KEY = originalKey;
    vi.resetModules();
  });

  it("rejects non-image uploads before calling the provider", async () => {
    process.env.OPENROUTER_API_KEY = "test-key";
    const { default: handler } = await import("../../api/analyze-exam-schedule");
    const { res } = mockResponse();
    await handler({ method: "POST", body: { imageDataUrl: "data:text/plain;base64,SGVsbG8=" } } as any, res as any);

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: "Please provide a PNG, JPG, or WebP image" });
  });

  it("accepts a valid image data URL and returns the provider response", async () => {
    process.env.OPENROUTER_API_KEY = "test-key";
    const provider = vi.fn(async () => new Response(JSON.stringify({
      choices: [{ message: { content: JSON.stringify({ exams: [{ course: "فيزياء", date: "2026-09-10", start_time: "09:00", end_time: "11:00", room: "12", chapters: 6 }] }) } }],
    }), { status: 200, headers: { "Content-Type": "application/json" } }));
    vi.stubGlobal("fetch", provider);

    const { default: handler } = await import("../../api/analyze-exam-schedule");
    const { res } = mockResponse();
    await handler({ method: "POST", body: { imageDataUrl: "data:image/png;base64,iVBORw0KGgo=" } } as any, res as any);

    expect(res.statusCode).toBe(200);
    expect((res.body as any).choices[0].message.content).toContain("2026-09-10");
    expect(provider).toHaveBeenCalledTimes(1);
  });

  it("parses the server response in the client extraction helper", async () => {
    const provider = vi.fn(async () => new Response(JSON.stringify({
      choices: [{ message: { content: `\`\`\`json
{"exams":[{"course":"Physics I","date":"2026-09-10","start_time":"09:00","end_time":"11:00","room":"12"}]}
\`\`\`` } }],
    }), { status: 200, headers: { "Content-Type": "application/json" } }));
    vi.stubGlobal("fetch", provider);

    const { extractExamScheduleFromImage } = await import("@/services/ai-integration");
    const result = await extractExamScheduleFromImage("data:image/jpeg;base64,ZmFrZQ==");

    expect(result).toEqual({ success: true, exams: [{ course: "Physics I", date: "2026-09-10", start_time: "09:00", end_time: "11:00", room: "12" }] });
    expect(provider).toHaveBeenCalledWith("/api/analyze-exam-schedule", expect.objectContaining({ method: "POST" }));
  });
});
