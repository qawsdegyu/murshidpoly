import { supabase } from "@/lib/supabase";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_KEY = (import.meta.env.VITE_OPENROUTER_API_KEY || (typeof process !== 'undefined' ? process.env.OPENROUTER_API_KEY : '')) as string;
const OPENROUTER_MODEL = "openai/gpt-4o-mini";

export interface AIResponse {
  success: boolean;
  answer?: string;
  context?: string[];
  error?: string;
  suggestion?: string;
  sources?: { title: string; url?: string | null }[];
}



export async function fetchSupabaseContext(query: string): Promise<{ contexts: string[]; sources: { title: string; url?: string | null }[] }> {
  const cleanQuery = query.replace(/[؟?.,!]/g, "").trim();
  const words = cleanQuery.split(/\s+/).filter(w => w.length > 2);
  const rawContexts: { content: string, score: number, type: string, title?: string, url?: string | null }[] = [];

  try {
    // Improved Keyword Search with Ranking and Synonyms
    const cleanQueryLower = normalizeArabic(cleanQuery);

    // Add specific synonyms for common student terms
    const searchTerms = [...words];
    if (cleanQueryLower.includes("ميد") || cleanQueryLower.includes("نصفي")) {
      searchTerms.push("نصفي", "Term", "Mid");
    }
    if (cleanQueryLower.includes("فاينل") || cleanQueryLower.includes("نهائي")) {
      searchTerms.push("نهائي", "النهائية");
    }
    if (cleanQueryLower.includes("عميد") || cleanQueryLower.includes("رئيس")) {
      searchTerms.push("شروط", "تعيين", "مواصفات", "صلاحيات");
    }
    if (cleanQueryLower.includes("اسقاط") || cleanQueryLower.includes("سحب") || cleanQueryLower.includes("انسحاب") || cleanQueryLower.includes("تأجيل")) {
      searchTerms.push("انسحاب", "سحب", "تأجيل", "انقطاع", "إسقاط", "تأجيل الدراسة", "إسقاط المواد");
    }

    if (searchTerms.length === 0) return { contexts: [], sources: [] };

    // Search small, AI-ready passages instead of downloading whole source blobs.
    // RLS exposes only active chunks whose parent source is ready.
    const knowledgePromises = searchTerms.slice(0, 12).flatMap(term => {
      const escaped = term.replace(/[%_]/g, "\\$&");
      return [
        supabase
          .from("chatbot_knowledge_chunks")
          .select("content, normalized_content, source_id, chatbot_knowledge_sources!inner(title, file_name, file_url, is_active, processing_status, assistant_scope)")
          .eq("is_active", true)
          .eq("chatbot_knowledge_sources.is_active", true)
          .eq("chatbot_knowledge_sources.processing_status", "ready")
          .eq("chatbot_knowledge_sources.assistant_scope", "murshid")
          .ilike("normalized_content", `%${escaped}%`)
          .limit(8),
      ];
    });

    const searchTasks = [
      supabase.from("documents").select("content").ilike("content", `%${cleanQuery}%`).limit(5),
      ...searchTerms.map(word =>
        supabase
          .from("documents")
          .select("content")
          .ilike("content", `%${word}%`)
          .limit(5)
      )
    ];

    const results = await Promise.all(searchTasks);

    results.forEach(({ data: wordDocs }) => {
      if (wordDocs) {
        wordDocs.forEach((doc: any) => {
          let score = 0;
          const docNormalized = normalizeArabic(doc.content);

          searchTerms.forEach(w => {
            if (docNormalized.includes(normalizeArabic(w))) {
              score += 20;
              if (docNormalized.split(/\s+/).includes(normalizeArabic(w))) score += 30;
            }
          });

          if (docNormalized.includes(cleanQueryLower)) score += 100;
          if (doc.content.includes("بداية امتحانات")) score += 40;
          if (doc.content.includes("امتحان نصفي") || doc.content.includes("Mid Term")) score += 40;

          if (cleanQuery.includes("الثاني")) {
            if (doc.content.includes("الفصل الثاني")) score += 100;
          }
          if (cleanQuery.includes("الأول")) {
            if (doc.content.includes("الفصل الأول")) score += 100;
          }

          if (score > 0) {
            rawContexts.push({ content: doc.content, score, type: `DB Match (Score: ${score})` });
          }
        });
      }
    });

    const knowledgeResults = await Promise.all(knowledgePromises);
    knowledgeResults.forEach(({ data: chunks }) => {
      (chunks || []).forEach((chunk: any) => {
        const source = Array.isArray(chunk.chatbot_knowledge_sources)
          ? chunk.chatbot_knowledge_sources[0]
          : chunk.chatbot_knowledge_sources;
        const sourceText = String(chunk.content || "");
        const normalizedSource = normalizeArabic(sourceText);
        let score = 20;
        searchTerms.forEach((term) => {
          const normalizedTerm = normalizeArabic(term);
          if (normalizedSource.includes(normalizedTerm)) score += 25;
          if (normalizedSource.split(/\s+/).includes(normalizedTerm)) score += 35;
        });
        if (normalizedSource.includes(cleanQueryLower)) score += 120;
        if (score > 0) {
          rawContexts.push({
            content: sourceText,
            score,
            type: `Supabase Knowledge chunk: ${source?.title || source?.file_name || "source"}`,
            title: source?.title || source?.file_name || "Supabase source",
            url: source?.file_url || null,
          });
        }
      });
    });

    const sorted = rawContexts
      .sort((a, b) => b.score - a.score)
      .filter((v, i, a) => a.findIndex(t => t.content.substring(0, 50) === v.content.substring(0, 50)) === i)
      .slice(0, 8);

    return {
      contexts: sorted.map(c => `[${c.type}] ${c.content}`),
      sources: sorted.filter(c => c.title).map(c => ({ title: c.title!, url: c.url })).filter((source, index, all) => all.findIndex(item => item.title === source.title && item.url === source.url) === index),
    };
  } catch (error) {
    console.error("Supabase Context Error:", error);
    return { contexts: [], sources: [] };
  }
}

// Normalize Arabic text to handle common spelling variations (ة/ه, أ/ا/إ, etc.)
function normalizeArabic(text: string): string {
  return text
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/[ىي]/g, "ي")
    .replace(/[ًٌٍَُِّ]/g, "") // Remove diacritics
    .toLowerCase()
    .trim();
}

// Fetch available courses and sections to give the AI real data to suggest
async function fetchCoursesContext(query: string): Promise<string> {
  const q = normalizeArabic(query);
  const isAskingForSuggestions = q.includes("مواد") || q.includes("جدول") || q.includes("تنزي") || q.includes("اقتراح") || q.includes("انزل");

  if (!isAskingForSuggestions) return "";

  try {
    const { data: courses } = await supabase
      .from("courses")
      .select("id, name_ar, code, credit_hours")
      .limit(30);

    if (!courses || courses.length === 0) return "";

    let context = courses.map(c => `- ${c.name_ar} (الرمز: ${c.code}, ساعات: ${c.credit_hours})`).join("\n");

    // Also fetch some sample sections to show the AI there are real times
    const { data: sections } = await supabase
      .from("sections")
      .select("course_id, instructor_name, start_time, end_time")
      .limit(15);

    if (sections && sections.length > 0) {
      context += "\n\n[أمثلة على شُعب متاحة]:\n" + sections.map(s => {
        const c = courses.find(course => course.id === s.course_id || course.code === s.course_id);
        return `- مادة ${c?.name_ar || s.course_id} مع المدرس ${s.instructor_name} (الوقت: ${s.start_time}-${s.end_time})`;
      }).join("\n");
    }

    return context;
  } catch (err) {
    console.error("Fetch Courses Context Error:", err);
    return "";
  }
}

export async function performKnowledgeRAG(userQuestion: string, userName?: string, isFirstMessage?: boolean): Promise<AIResponse> {
  try {
    const [knowledgeResult, coursesContext] = await Promise.all([
      fetchSupabaseContext(userQuestion),
      fetchCoursesContext(userQuestion)
    ]);

    const combinedContext = [
      ...knowledgeResult.contexts.map(c => `[بيانات الموقع]: ${c}`),
      coursesContext ? `[المواد المتاحة للتسجيل حالياً]:\n${coursesContext}` : ""
    ].filter(Boolean).join("\n\n---\n\n");

    console.log(`[AI RAG] Final context length: ${combinedContext.length} chars`);
    const contextString = combinedContext || "لا يوجد سياق مباشر. أجب بناءً على معرفتك العامة بسياسات الجامعات الأردنية ولكن بحذر.";

    const systemPrompt = `أنت "مُساعد مُرشد الذكي" المتخصص في جامعة البلقاء التطبيقية (BAU).

وظيفتك الإجابة على استفسارات الطلاب والتخطيط الأكاديمي بناءً على المراجع المقدمة فقط.

${userName && !["المهندس", "مهندس", "المهندسة", "مهندسة"].includes(userName)
        ? `اسم الطالب الذي يتحدث معك هو: ${userName}. ناده دائماً بلقب "مهندس ${userName}".`
        : "ناده دائماً بلقب 'يا مهندس' فقط دون تكرار كلمة مهندس إذا كان الاسم غير معروف."}

قواعد الإجابة الصارمة (STRICT RULES):
1. أجب بلهجة أردنية بيضاء ودودة ومهنية.
2. الترحيب في أول رسالة (${isFirstMessage ? "نعم" : "لا"}): ابدأ بـ "أهلاً بك يا مهندس ${userName || "[الاسم]"}!" ثم سطر جديد.
3. التزم حرفياً بالمراجع: عند سؤال الطالب عن طبيعة مادة أو كيفية دراستها، اقرأ النص الموجود في [REFERENCES] وانقله بأسلوبك الودي، ولكن **إياك ثم إياك** أن تؤلف نصائح عامة من عندك (مثل: "تواصل مع الدكتور"، "انضم لمجموعات دراسية"، "ادرس الأساسيات"). إذا كانت المراجع تقول جملة واحدة (مثلاً: "حلوا أسئلة سنوات")، فقل فقط هذه الجملة ولا تضف نقاطاً من رأسك!
4. الأمانة العلمية: إذا لم تجد المادة في المراجع، قل بوضوح: "عذراً يا مهندس، لم أجد تفاصيل أكيدة بخصوص هذا الموضوع في قاعدة بياناتي حالياً، ولكن بشكل عام..."
5. رتب الإجابة في نقاط واضحة ومختصرة بناءً على المراجع فقط، ولا تستخدم حشواً للكلام.`;

    const userPrompt = `[USER NAME]: ${userName || "Unknown"}\n[IS FIRST MESSAGE]: ${isFirstMessage ? "Yes" : "No"}\n\n[REFERENCES]\n${contextString}\n\n[USER QUESTION]\n${userQuestion}`;

    // Use OpenRouter (Cloud)
    if (!OPENROUTER_KEY) {
      throw new Error("OpenRouter API Key is missing");
    }

    const orResponse = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://murshid-bau.com",
        "X-Title": "Murshid Knowledge Assistant"
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.3
      }),
    });

    if (!orResponse.ok) {
      const errorData = await orResponse.json();
      throw new Error(errorData.error?.message || "OpenRouter failed");
    }

    const orData = await orResponse.json();
    return {
      success: true,
      answer: orData.choices[0].message.content,
      context: combinedContext ? combinedContext.split("\n\n---\n\n") : [],
      sources: knowledgeResult.sources,
    };

  } catch (err: any) {
    console.error("RAG Error:", err);
    return { success: false, error: err.message };
  }
}
