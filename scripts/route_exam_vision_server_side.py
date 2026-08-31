from pathlib import Path
import re

path = Path('/home/ubuntu/murshidpoly/src/services/ai-integration.ts')
s = path.read_text()
replacement = '''export async function extractExamScheduleFromImage(imageDataUrl: string): Promise<ExamScheduleExtractionResult> {
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
    const jsonMatch = content.match(/\\{[\\s\\S]*\\}/);
    const parsed = JSON.parse(jsonMatch?.[0] || content || "{}");
    const exams = Array.isArray(parsed.exams) ? parsed.exams.filter((exam: unknown): exam is ExtractedExam => Boolean(exam && typeof exam === "object" && "course" in exam && String((exam as { course?: unknown }).course || "").trim())) : [];
    return { success: true, exams };
  } catch (error: unknown) {
    console.error("Exam schedule extraction error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Could not extract exam schedule" };
  }
}'''
pattern = r'export async function extractExamScheduleFromImage\(imageDataUrl: string\): Promise<ExamScheduleExtractionResult> \{[\s\S]*?\n\}'
s, count = re.subn(pattern, lambda _match: replacement, s, count=1)
if count != 1:
    raise SystemExit('function not found')
path.write_text(s)
print('patched')
