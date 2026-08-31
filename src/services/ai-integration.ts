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
          .eq("chatbot_knowledge_sources.assistant_scope", "legacy")
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

export async function performRAG(userQuestion: string, userName?: string, isFirstMessage?: boolean): Promise<AIResponse> {
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
        "X-Title": "Murshid AI Assistant"
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

/**
 * AI-driven schedule recommendation engine.
 * Picks the best sections for a student based on their major's curriculum plan
 * and the available sections in the database.
 */
export async function getSmartScheduleRecommendations(
  major: string,
  year: number,
  semester: number,
  dbSections: any[],
  selectedCourses: any[],
  targetHours: number,
  intent: 'balanced' | 'relaxed' | 'compressed' = 'balanced',
  roadmapCourses: any[] = [],
  avoidTeachers: string[] = [],
  blockedSlots: { day: number, start: string, end: string }[] = [],
  maxStudyDays: number = 5,
  minStartTime: string = "08:00"
): Promise<{ success: boolean; suggestions?: any[]; error?: string }> {
  try {
    const selectedCourseIds = selectedCourses.map(c => c.id);

    // 1. Filter sections based on avoidTeachers
    const filteredSections = dbSections.filter(s => {
      if (avoidTeachers.length > 0) {
        if (avoidTeachers.includes(s.instructorName || '') || avoidTeachers.includes(s.instructorAr || '')) return false;
      }
      return true;
    });

    const sectionsContext = filteredSections
      .filter(s => selectedCourseIds.includes(s.courseId))
      .reduce((acc: any[], s) => {
        // Limit to 10 sections per course to keep context window manageable
        const currentCount = acc.filter(item => item.courseId === s.courseId).length;
        if (currentCount < 10) {
          const c = selectedCourses.find(rc => rc.id === s.courseId);
          acc.push({
            id: s.id,
            courseId: s.courseId,
            course: c?.nameAr,
            instructor: s.instructorName,
            days: s.days,
            time: `${s.startTime}-${s.endTime}`
          });
        }
        return acc;
      }, []);

    const intentPrompts = {
      balanced: "Create a balanced schedule with reasonable gaps between lectures.",
      relaxed: "Create a relaxed schedule, preferably starting late and having long breaks. Avoid early 8 AM lectures.",
      compressed: "Create a compressed schedule, minimizing the number of days or gaps between lectures to finish early."
    };

    const systemPrompt = `You are the "Smart Schedule Optimizer" for Murshid platform.
Your task is to take the student's selected courses and find as many distinct and diverse ways as possible to arrange their sections (up to 12 options).

TARGET HOURS: ${targetHours}h
CURRENTLY SELECTED: ${selectedCourses.reduce((sum, c) => sum + (c.hours || 0), 0)}h
COURSES SELECTED: ${selectedCourses.map(c => c.nameAr).join(', ')}

INTENT: ${intentPrompts[intent]}

RULES:
1. Include exactly one section for EVERY SINGLE selected course.
2. MAXIMIZE DIVERSITY: Each suggestion should feel unique. 
   - DO NOT repeat the same section IDs across different suggestions if alternatives exist.
   - VARY the days: If Option 1 is Sunday/Tuesday/Thursday, try to make Option 2 prioritize Monday/Wednesday.
   - VARY the times: Try some early morning variants, some late afternoon, and some midday.
   - VARY the instructors: If a course has multiple instructors, pick different ones for each suggestion.
3. If total hours < ${targetHours}, you MUST suggest adding 1-2 courses from the roadmap to reach the target in at least 2 of the suggestions.
4. For each suggestion, provide a unique title and a description in Jordanian Arabic dialect.
5. Suggestions should be varied:
   - Provide the most convenient options first.
   - Provide variations with completely different instructors or significantly different time blocks.
   - Provide "Goal Reach" variants where you suggest adding courses to hit ${targetHours}h.
   - GENERATE AS MANY UNIQUE OPTIONS AS THE DATA ALLOWS (UP TO 12).
6. MANDATORY CONSTRAINTS:
   - AVOID TEACHERS: ${avoidTeachers.join(', ')}
   - BLOCKED TIME SLOTS (STUDENT CANNOT STUDY AT THESE TIMES): ${JSON.stringify(blockedSlots)}
   - MAX STUDY DAYS: ${maxStudyDays} days per week.
   - EARLIEST START TIME: No classes before ${minStartTime}.
   - If a section overlaps with a blocked slot or starts before ${minStartTime}, DO NOT USE IT.
7. ANTI-REPETITION RULES (CRITICAL):
   - You MUST provide 12 suggestions that are DIFFERENT from each other.
   - For every suggestion, try to pick a different instructor or different time slot if available.
   - If you provide the exact same section IDs for more than 2 suggestions, you have FAILED.
   - Diversify the "Day Off" - if one schedule has Sunday off, make another with Thursday off.
   - If a course only has one section, keep it but change the instructors/times of ALL other courses in the next suggestion.
8. GENERATE AS MANY UNIQUE OPTIONS AS THE DATA ALLOWS (UP TO 12).

ROADMAP COURSES AVAILABLE:
${JSON.stringify(roadmapCourses.slice(0, 50))}

SECTIONS DATA:
${JSON.stringify(sectionsContext)}

RETURN ONLY JSON:
{
  "suggestions": [
    {
      "titleAr": "...",
      "titleEn": "...",
      "descriptionAr": "...",
      "descriptionEn": "...",
      "sectionIds": ["id1", "id2", ...],
      "additionalCourseIds": ["course_id1", ...] 
    }
  ]
}
Generate as many DISTINCT and high-variety suggestions as possible (up to 12). If you find multiple sections for a course, use different ones across the options.`;

    const userPrompt = `
Context:
Major: ${major}
Year: ${year}
Semester: ${semester}

Available Sections:
${JSON.stringify(sectionsContext.slice(0, 100))}

Suggest as many best diverse options as possible as per the intent (up to 12). Return ONLY the JSON array.`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "google/gemini-1.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.8
      })
    });

    if (!response.ok) throw new Error("AI API request failed");

    const data = await response.json();
    const content = data.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    const jsonStr = jsonMatch ? jsonMatch[0] : content;
    const parsed = JSON.parse(jsonStr);

    // Support both { suggestions: [...] } and direct [...] formats
    const suggestions = Array.isArray(parsed) ? parsed : (parsed.suggestions || []);

    return { success: true, suggestions };
  } catch (error: any) {
    console.error("Smart Schedule AI Error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Detects if Ollama is running locally and returns available models.
 * Used primarily in the Admin Dashboard for AI diagnostics.
 */
export async function detectOllama(): Promise<{ status: string; models: string[] }> {
  try {
    const response = await fetch("http://localhost:11434/api/tags", {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });

    if (!response.ok) throw new Error("Ollama not responding");

    const data = await response.json();
    return {
      status: "online",
      models: data.models?.map((m: any) => m.name) || []
    };
  } catch (err) {
    return {
      status: "offline",
      models: []
    };
  }
}


export interface ExtractedExam {
  course: string;
  date: string;
  start_time?: string | null;
  end_time?: string | null;
  room?: string | null;
  notes?: string | null;
  title?: string;
  chapters?: number;
}

export interface ExamScheduleExtractionResult {
  success: boolean;
  exams?: ExtractedExam[];
  error?: string;
}

/** Extracts exam rows from a student-provided image. The result is always reviewed by the student in the UI. */
export async function extractExamScheduleFromImage(imageDataUrl: string): Promise<ExamScheduleExtractionResult> {
  try {
    const response = await fetch("/api/analyze-exam-schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageDataUrl }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload?.error || "Image analysis failed");
    const rawContent = payload?.choices?.[0]?.message?.content;
    const content = typeof rawContent === "string" ? rawContent.replace(/```(?:json)?/gi, "").replace(/```/g, "").trim() : "{}";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch?.[0] || content || "{}");
    const exams = Array.isArray(parsed.exams) ? parsed.exams.filter((exam: unknown): exam is ExtractedExam => Boolean(exam && typeof exam === "object" && "course" in exam && String((exam as { course?: unknown }).course || "").trim())) : [];
    return { success: true, exams };
  } catch (error: unknown) {
    console.error("Exam schedule extraction error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Could not extract exam schedule" };
  }
}
