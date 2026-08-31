import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Clock3, FileImage, Loader2, Plus, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { usePreferences } from "@/contexts/PreferencesContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { extractExamScheduleFromImage, type ExtractedExam } from "@/services/ai-integration";
import { cn } from "@/lib/utils";

type StudyExam = ExtractedExam & { chapters: number };
type StudyBlock = { date: string; course: string; label: string; hours: number; kind: "study" | "review" };

const todayIso = () => new Date().toISOString().slice(0, 10);

export default function ExamStudyPlanner() {
  const { lang } = usePreferences();
  const { user } = useAuth();
  const isAr = lang === "ar";
  const [imagePreview, setImagePreview] = useState("");
  const [exams, setExams] = useState<StudyExam[]>([]);
  const [dailyHours, setDailyHours] = useState(4);
  const [startTime, setStartTime] = useState("05:00");
  const [studyMinutes, setStudyMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [studyDays, setStudyDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const [timerMode, setTimerMode] = useState<"study" | "break">("study");
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [plan, setPlan] = useState<StudyBlock[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const sortedExams = useMemo(() => [...exams].sort((a, b) => a.date.localeCompare(b.date)), [exams]);

  useEffect(() => {
    setTimerSeconds((timerMode === "study" ? studyMinutes : breakMinutes) * 60);
  }, [studyMinutes, breakMinutes, timerMode]);

  useEffect(() => {
    if (!timerRunning) return;
    const interval = window.setInterval(() => {
      setTimerSeconds((current) => {
        if (current > 1) return current - 1;
        const nextMode = timerMode === "study" ? "break" : "study";
        const nextMinutes = nextMode === "study" ? studyMinutes : breakMinutes;
        if (typeof Notification !== "undefined" && Notification.permission === "granted") {
          new Notification(nextMode === "study" ? (isAr ? "حان وقت الدراسة" : "Study time") : (isAr ? "حان وقت الاستراحة" : "Break time"));
        }
        setTimerMode(nextMode);
        return nextMinutes * 60;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [timerRunning, timerMode, studyMinutes, breakMinutes, isAr]);

  const requestNotifications = async () => {
    if (typeof Notification === "undefined") return;
    const permission = await Notification.requestPermission();
    if (permission !== "granted") toast.error(isAr ? "فعّل إشعارات المتصفح لاستقبال تنبيهات الجلسات" : "Allow browser notifications to receive session alerts");
  };

  const toggleDay = (day: number) => {
    setStudyDays((current) => current.includes(day) ? current.filter((d) => d !== day) : [...current, day].sort());
  };

  const handleImage = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error(isAr ? "يرجى رفع صورة جدول الامتحانات" : "Please upload an exam schedule image");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error(isAr ? "حجم الصورة يجب أن يكون أقل من 8 ميغابايت" : "Image must be smaller than 8 MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      const sourceUrl = String(reader.result || "");
      const dataUrl = await new Promise<string>((resolve) => {
        const image = new Image();
        image.onload = () => {
          const maxSide = 1800;
          const scale = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight));
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
          canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
          const context = canvas.getContext("2d");
          context?.drawImage(image, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", 0.88));
        };
        image.onerror = () => resolve(sourceUrl);
        image.src = sourceUrl;
      });
      setImagePreview(dataUrl);
      setIsAnalyzing(true);
      try {
        const result = await extractExamScheduleFromImage(dataUrl);
        if (!result.success || !result.exams?.length) throw new Error(result.error || "No exams found");
        setExams(result.exams.map((exam) => ({ ...exam, chapters: exam.chapters || 6 })));
        toast.success(isAr ? `تم استخراج ${result.exams.length} امتحانات، راجع البيانات قبل التوليد` : `Extracted ${result.exams.length} exams. Review them before generating.`);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        toast.error(isAr ? `تعذر تحليل الصورة: ${message === "Unknown error" ? "خطأ غير معروف" : message}` : `Could not analyze image: ${message}`);
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const updateExam = (target: StudyExam, field: keyof StudyExam, value: string) => {
    setExams((current) => current.map((exam) => exam === target ? { ...exam, [field]: field === "chapters" ? Math.max(1, Number(value) || 1) : value } : exam));
  };

  const generatePlan = async () => {
    if (!sortedExams.length) return;
    if (!dailyHours || dailyHours < 1 || !studyDays.length) {
      toast.error(isAr ? "حدد ساعات الدراسة ويومًا واحدًا على الأقل" : "Set study hours and at least one study day");
      return;
    }
    if (sortedExams.some((exam) => !/^\d{4}-\d{2}-\d{2}$/.test(exam.date))) {
      toast.error(isAr ? "أكمل تواريخ جميع الامتحانات قبل إنشاء الخطة" : "Complete every exam date before generating the plan");
      return;
    }
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 250));
    const result: StudyBlock[] = [];
    const start = new Date(`${todayIso()}T00:00:00`);
    const end = new Date(Math.max(...sortedExams.map((exam) => new Date(`${exam.date}T00:00:00`).getTime())));
    const active = sortedExams.map((exam) => ({ ...exam, remaining: Math.max(1, exam.chapters) }));
    for (let cursor = new Date(start); cursor <= end; cursor.setDate(cursor.getDate() + 1)) {
      if (!studyDays.includes(cursor.getDay())) continue;
      const date = cursor.toISOString().slice(0, 10);
      const available = active.filter((exam) => exam.date >= date && exam.remaining > 0);
      if (!available.length) continue;
      let remainingHours = dailyHours;
      for (const exam of available.sort((a, b) => a.date.localeCompare(b.date))) {
        if (remainingHours <= 0) break;
        const daysLeft = Math.max(1, Math.ceil((new Date(`${exam.date}T00:00:00`).getTime() - cursor.getTime()) / 86400000));
        const hours = Math.min(remainingHours, Math.max(0.5, Math.ceil((exam.remaining / daysLeft) * 2) / 2));
        result.push({ date, course: exam.course, label: exam.title || (isAr ? "مذاكرة" : "Study"), hours, kind: "study" });
        exam.remaining -= Math.max(1, Math.round(hours));
        remainingHours -= hours;
      }
      const dueToday = active.filter((exam) => exam.date === date);
      dueToday.forEach((exam) => result.push({ date, course: exam.course, label: isAr ? "مراجعة نهائية" : "Final review", hours: 0.5, kind: "review" }));
    }
    setPlan(result);
    if (user) {
      const { data: savedPlan, error: planError } = await supabase.from("exam_study_plans").insert({
        user_id: user.id,
        title: isAr ? "خطة دراسة الامتحانات" : "Exam study plan",
        exams: sortedExams,
        preferences: { dailyHours, startTime, studyMinutes, breakMinutes, studyDays },
        study_blocks: result,
        timezone: "Asia/Amman",
      }).select("id").single();
      if (!planError && savedPlan?.id && result.length) {
        await supabase.from("exam_study_sessions").insert(result.map((block) => {
          const durationMinutes = Math.max(1, Math.round(block.hours * 60));
          const startsAt = new Date(`${block.date}T${startTime}:00+03:00`);
          return {
            plan_id: savedPlan.id,
            user_id: user.id,
            session_type: block.kind,
            course: block.course,
            starts_at: startsAt.toISOString(),
            ends_at: new Date(startsAt.getTime() + durationMinutes * 60000).toISOString(),
            duration_minutes: durationMinutes,
          };
        }));
      }
      if (planError) toast.error(isAr ? "تم إنشاء الخطة محليًا، وتعذر حفظها في قاعدة البيانات" : "Plan generated locally, but database save failed");
    }
    setIsGenerating(false);
    toast.success(isAr ? "تم إنشاء خطة الدراسة حسب مواعيد الامتحانات" : "Study plan generated from your exam dates");
  };

  const dayNames = isAr ? ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"] : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const timerLabel = `${String(Math.floor(timerSeconds / 60)).padStart(2, "0")}:${String(timerSeconds % 60).padStart(2, "0")}`;

  return (
    <section className="mt-10 rounded-[2rem] border border-accent/20 bg-surface/50 p-5 md:p-7 shadow-xl shadow-accent/5">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-accent"><Sparkles className="h-5 w-5" /><span className="text-[10px] font-black uppercase tracking-[0.2em]">{isAr ? "منسق الامتحانات" : "Exam study planner"}</span></div>
          <h2 className="text-2xl font-black">{isAr ? "حوّل جدول امتحاناتك إلى خطة دراسة" : "Turn your exam schedule into a study plan"}</h2>
          <p className="mt-2 max-w-2xl text-sm font-bold leading-6 text-muted-foreground">{isAr ? "ارفع صورة الجدول، راجع المواد والتواريخ المستخرجة، ثم حدد ساعاتك ليبني لك النظام خطة يومية قابلة للتعديل." : "Upload your schedule, review the extracted courses and dates, then set your available hours for an editable daily plan."}</p>
        </div>
        <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-accent px-5 py-3 text-sm font-black text-accent-foreground transition-transform hover:scale-[1.02]">
          {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileImage className="h-4 w-4" />}
          {isAnalyzing ? (isAr ? "جاري التحليل..." : "Analyzing...") : (isAr ? "رفع صورة الجدول" : "Upload schedule")}
          <input type="file" accept="image/*" className="hidden" disabled={isAnalyzing} onChange={(event) => handleImage(event.target.files?.[0])} />
        </label>
      </div>

      {imagePreview && <div className="mt-5 flex items-center gap-3 rounded-2xl border border-border/50 bg-background/30 p-3"><img src={imagePreview} alt={isAr ? "صورة جدول الامتحانات" : "Exam schedule preview"} className="h-16 w-24 rounded-xl object-cover" /><span className="text-xs font-bold text-muted-foreground">{isAr ? "تم تحميل الصورة. يمكنك تعديل النتائج يدويًا قبل توليد الخطة." : "Image loaded. You can edit the extracted rows before generating."}</span></div>}

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.4fr_.6fr]">
        <div className="space-y-3">
          <div className="flex items-center justify-between"><h3 className="font-black">{isAr ? "الامتحانات المستخرجة" : "Extracted exams"}</h3><button type="button" onClick={() => setExams((current) => [...current, { course: isAr ? "مادة جديدة" : "New course", date: todayIso(), title: "", chapters: 6 }])} className="inline-flex items-center gap-1 rounded-xl border border-border px-3 py-2 text-xs font-black hover:border-accent/50"><Plus className="h-3.5 w-3.5" />{isAr ? "إضافة" : "Add"}</button></div>
          {sortedExams.length === 0 ? <div className="rounded-2xl border border-dashed border-border/70 p-8 text-center text-sm font-bold text-muted-foreground">{isAr ? "ارفع صورة جدول الامتحانات أو أضف مادة يدويًا." : "Upload an exam schedule or add an exam manually."}</div> : sortedExams.map((exam, index) => <div key={`${exam.course}-${index}`} className="grid gap-2 rounded-2xl border border-border/60 bg-background/30 p-3 sm:grid-cols-[1.2fr_.8fr_.5fr_auto] sm:items-end"><label className="text-xs font-black text-muted-foreground">{isAr ? "المادة" : "Course"}<input value={exam.course} onChange={(e) => updateExam(exam, "course", e.target.value)} className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm font-bold outline-none focus:border-accent" /></label><label className="text-xs font-black text-muted-foreground">{isAr ? "التاريخ" : "Date"}<input type="date" value={exam.date} onChange={(e) => updateExam(exam, "date", e.target.value)} className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm font-bold outline-none focus:border-accent" /></label><label className="text-xs font-black text-muted-foreground">{isAr ? "الفصول" : "Chapters"}<input type="number" min="1" value={exam.chapters} onChange={(e) => updateExam(exam, "chapters", e.target.value)} className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm font-bold outline-none focus:border-accent" /></label><div className="text-[10px] font-bold leading-5 text-muted-foreground"><p>{exam.start_time && exam.end_time ? `${exam.start_time} - ${exam.end_time}` : (isAr ? "الوقت غير مستخرج" : "Time not extracted")}</p><p className="truncate" title={exam.room || ""}>{exam.room || (isAr ? "القاعة غير مستخرجة" : "Room not extracted")}</p></div><button type="button" onClick={() => setExams((current) => current.filter((item) => item !== exam))} className="rounded-xl p-2 text-red-400 hover:bg-red-500/10" aria-label={isAr ? "حذف" : "Delete"}><Trash2 className="h-4 w-4" /></button></div>)}
        </div>

        <div className="space-y-4 rounded-2xl border border-border/60 bg-background/25 p-4">
          <h3 className="font-black">{isAr ? "تفضيلات الدراسة" : "Study preferences"}</h3>
          <label className="block text-xs font-black text-muted-foreground">{isAr ? "ساعات الدراسة اليومية" : "Daily study hours"}<div className="mt-2 flex items-center gap-3"><Clock3 className="h-4 w-4 text-accent" /><input type="number" min="1" max="16" step="0.5" value={dailyHours} onChange={(e) => setDailyHours(Number(e.target.value))} className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm font-black outline-none focus:border-accent" /></div></label>
          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs font-black text-muted-foreground">{isAr ? "بداية الخطة" : "Start time"}<input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="mt-2 w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm font-black outline-none focus:border-accent" /></label>
            <label className="text-xs font-black text-muted-foreground">{isAr ? "جلسة / استراحة" : "Study / break"}<div className="mt-2 flex gap-1"><input type="number" min="1" value={studyMinutes} onChange={(e) => setStudyMinutes(Math.max(1, Number(e.target.value)))} className="w-1/2 rounded-xl border border-border bg-surface px-2 py-2 text-sm font-black outline-none focus:border-accent" /><input type="number" min="1" value={breakMinutes} onChange={(e) => setBreakMinutes(Math.max(1, Number(e.target.value)))} className="w-1/2 rounded-xl border border-border bg-surface px-2 py-2 text-sm font-black outline-none focus:border-accent" /></div></label>
          </div>
          <div className="rounded-2xl border border-accent/20 bg-accent/5 p-4 text-center"><p className="text-[10px] font-black text-muted-foreground">{timerMode === "study" ? (isAr ? "جلسة دراسة" : "Study session") : (isAr ? "استراحة" : "Break")}</p><p className="my-2 text-4xl font-black tabular-nums text-accent">{timerLabel}</p><div className="flex gap-2"><button type="button" onClick={requestNotifications} className="flex-1 rounded-xl border border-border px-2 py-2 text-[10px] font-black">{isAr ? "تفعيل التنبيه" : "Enable alerts"}</button><button type="button" onClick={() => setTimerRunning((running) => !running)} className="flex-1 rounded-xl bg-accent px-2 py-2 text-[10px] font-black text-accent-foreground">{timerRunning ? (isAr ? "إيقاف" : "Pause") : (isAr ? "ابدأ" : "Start")}</button><button type="button" onClick={() => { setTimerRunning(false); setTimerMode("study"); }} className="rounded-xl border border-border px-2 py-2 text-[10px] font-black">↺</button></div></div>
          <div><p className="mb-2 text-xs font-black text-muted-foreground">{isAr ? "أيام الدراسة" : "Study days"}</p><div className="grid grid-cols-4 gap-2">{dayNames.map((day, index) => <button type="button" key={day} onClick={() => toggleDay(index)} className={cn("rounded-xl border px-2 py-2 text-[10px] font-black transition-colors", studyDays.includes(index) ? "border-accent bg-accent/15 text-accent" : "border-border text-muted-foreground")}>{day}</button>)}</div></div>
          <button type="button" disabled={!sortedExams.length || isGenerating} onClick={generatePlan} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-accent py-3 text-sm font-black text-accent-foreground disabled:opacity-50">{isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <CalendarDays className="h-4 w-4" />}{isAr ? "إنشاء خطة الدراسة" : "Generate study plan"}</button>
        </div>
      </div>

      {plan.length > 0 && <div className="mt-7 border-t border-border/50 pt-5"><h3 className="mb-3 font-black">{isAr ? "الخطة اليومية" : "Daily plan"}</h3><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{plan.map((block, index) => <div key={`${block.date}-${block.course}-${index}`} className={cn("rounded-2xl border p-4", block.kind === "review" ? "border-amber-400/30 bg-amber-400/5" : "border-accent/20 bg-accent/5")}><div className="flex items-center justify-between gap-3 text-[10px] font-black text-muted-foreground"><span>{block.date}</span><span>{block.hours} {isAr ? "ساعة" : "h"}</span></div><p className="mt-2 text-sm font-black">{block.course}</p><p className="mt-1 text-xs font-bold text-muted-foreground">{block.label}</p></div>)}</div></div>}
    </section>
  );
}
