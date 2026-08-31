import { useEffect, useRef, useState } from "react";
import { FileText, Plus, RefreshCw, Trash2, Upload, Power, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { uploadFileWithMetadata } from "@/lib/storage";

const ACCEPTED_FILES = ".md,.txt,.csv,.json,.html,.htm,.xml,.yaml,.yml,.log,.pdf";
const TEXT_FILE_PATTERN = /\.(md|txt|csv|json|html|htm|xml|yaml|yml|log)$/i;

type CourseOption = { id: string; code?: string | null; name_ar?: string | null; majors?: string[] | null };

type KnowledgeSource = {
  id: string;
  title: string;
  file_name: string;
  content: string;
  file_url?: string | null;
  storage_path?: string | null;
  mime_type?: string | null;
  is_active: boolean;
  updated_at: string;
  processing_status?: "pending" | "processing" | "ready" | "failed";
  assistant_scope?: "legacy" | "murshid";
  processing_error?: string | null;
  character_count?: number;
  chunk_count?: number;
};

export default function ChatbotKnowledgeManager({ ar = true }: { ar?: boolean }) {
  const [sources, setSources] = useState<KnowledgeSource[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [courseId, setCourseId] = useState("");
  const [majorKey, setMajorKey] = useState("");
  const [courseOptions, setCourseOptions] = useState<CourseOption[]>([]);
  const [majorOptions, setMajorOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadSources = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("chatbot_knowledge_sources")
      .select("id,title,file_name,content,file_url,storage_path,mime_type,is_active,updated_at,processing_status,processing_error,character_count,chunk_count,assistant_scope")
      .eq("assistant_scope", "legacy")
      .order("updated_at", { ascending: false });
    if (error) toast.error(ar ? "تعذر تحميل مصادر البوت" : "Could not load bot sources");
    setSources((data || []) as KnowledgeSource[]);
    setLoading(false);
  };

  useEffect(() => {
    loadSources();
    (async () => {
      const { data } = await supabase.from("courses").select("id,code,name_ar,majors").order("name_ar", { ascending: true }).limit(1000);
      const courses = (data || []) as CourseOption[];
      setCourseOptions(courses);
      setMajorOptions(Array.from(new Set(courses.flatMap(course => course.majors || []).filter(Boolean))).sort());
    })();
  }, []);

  const handleFile = async (file?: File) => {
    if (!file) return;
    setSelectedFile(file);
    if (!title.trim()) setTitle(file.name.replace(/\.[^.]+$/, ""));
    if (TEXT_FILE_PATTERN.test(file.name)) {
      try {
        setContent(await file.text());
      } catch {
        toast.error(ar ? "تعذر قراءة معاينة الملف، لكن يمكنك متابعة الرفع" : "Could not preview the file, but upload can continue");
      }
    } else {
      setContent("");
    }
  };

  const addSource = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim() || (!content.trim() && !selectedFile)) {
      toast.error(ar ? "أدخل عنوانًا واختر ملفًا أو أضف محتوى" : "Enter a title and choose a file or add content");
      return;
    }
    setSaving(true);
    try {
      let upload: { url: string; path: string } | null = null;
      if (selectedFile) {
        upload = await uploadFileWithMetadata(selectedFile, "chatbot-knowledge");
        if (!upload) throw new Error(ar ? "تعذر رفع الملف إلى التخزين" : "Could not upload the file to storage");
      }
      const { data: createdSource, error } = await supabase.from("chatbot_knowledge_sources").insert({
        title: title.trim(),
        file_name: selectedFile?.name || `${title.trim()}.txt`,
        content: content.trim() || "جارٍ استخراج النص من الملف...",
        file_url: upload?.url || null,
        storage_path: upload?.path || null,
        mime_type: selectedFile?.type || "text/plain",
        course_id: courseId || null,
        major_key: majorKey || null,
        is_active: isActive,
        assistant_scope: "legacy",
      }).select("id").single();
      if (error) throw error;
      if (createdSource?.id) {
        const { data: sessionData } = await supabase.auth.getSession();
        const accessToken = sessionData.session?.access_token;
        const response = await fetch("/api/process-knowledge-source", {
          method: "POST",
          headers: { "Content-Type": "application/json", ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}) },
          body: JSON.stringify({ sourceId: createdSource.id, fileUrl: upload?.url, storagePath: upload?.path, mimeType: selectedFile?.type || "text/plain", fileName: selectedFile?.name || `${title.trim()}.txt`, content: selectedFile ? undefined : content.trim() }),
        });
        if (!response.ok) {
          const result = await response.json().catch(() => ({}));
          throw new Error(result.error || (ar ? "تم رفع الملف لكن تعذر استخراج النص" : "File uploaded but text extraction failed"));
        }
      }
      toast.success(ar ? "تم رفع الملف وتجهيزه للمساعد" : "File uploaded and prepared for the assistant");
      setTitle(""); setContent(""); setSelectedFile(null); setIsActive(true); setCourseId(""); setMajorKey("");
      if (inputRef.current) inputRef.current.value = "";
      loadSources();
    } catch (error: any) {
      toast.error(error?.message || (ar ? "تعذر حفظ المصدر" : "Could not save source"));
    } finally { setSaving(false); }
  };

  const toggleSource = async (source: KnowledgeSource) => {
    const { error } = await supabase.from("chatbot_knowledge_sources").update({ is_active: !source.is_active }).eq("id", source.id);
    if (error) toast.error(ar ? "تعذر تغيير حالة المصدر" : "Could not change source status");
    else loadSources();
  };

  const deleteSource = async (source: KnowledgeSource) => {
    if (!window.confirm(ar ? `حذف مصدر «${source.title}»؟` : `Delete “${source.title}”?`)) return;
    setLoading(true);
    const { error } = await supabase.from("chatbot_knowledge_sources").delete().eq("id", source.id);
    if (error) {
      toast.error(ar ? "تعذر حذف المصدر" : "Could not delete source");
    } else {
      if (source.storage_path) await supabase.storage.from("murshid-assets").remove([source.storage_path]);
      toast.success(ar ? "تم حذف المصدر" : "Source deleted");
      loadSources();
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6" dir={ar ? "rtl" : "ltr"}>
      <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/5 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h4 className="flex items-center gap-2 text-lg font-black"><FileText className="h-5 w-5 text-cyan-300" />{ar ? "مصادر إجابات تشات بوت" : "Chatbot knowledge sources"}</h4>
            <p className="mt-2 text-sm font-bold leading-6 text-muted-foreground">{ar ? "ارفع ملفًا نصيًا أو PDF بأي حجم عملي، وسيتم استخراج النص وتنظيفه وتقسيمه تلقائيًا ليستخدمه المساعد بكفاءة." : "Upload a text file or PDF within a practical size; text is extracted, cleaned, and chunked automatically for efficient answers."}</p>
          </div>
          <button type="button" onClick={loadSources} className="rounded-xl border border-white/10 bg-white/5 p-3 hover:bg-white/10" title="Refresh"><RefreshCw className={loading ? "h-4 w-4 animate-spin" : "h-4 w-4"} /></button>
        </div>
      </div>

      <form onSubmit={addSource} className="space-y-4 rounded-3xl border border-white/10 bg-surface/60 p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2"><span className="text-xs font-black text-muted-foreground">{ar ? "عنوان المصدر" : "Source title"}</span><input value={title} onChange={e => setTitle(e.target.value)} required className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm font-bold outline-none focus:border-primary" placeholder={ar ? "مثال: دليل الطالب" : "e.g. Student guide"} /></label>
          <label className="space-y-2"><span className="text-xs font-black text-muted-foreground">{ar ? "الملف" : "File"}</span><input ref={inputRef} type="file" accept={ACCEPTED_FILES} onChange={e => handleFile(e.target.files?.[0])} className="w-full rounded-2xl border border-border bg-card px-4 py-2.5 text-sm font-bold" /><span className="block text-[11px] font-bold text-muted-foreground">{ar ? "لا يوجد حد واجهة 10MB؛ الملفات الكبيرة تُرفع أولًا ثم تُعالج خادميًا." : "No 10MB UI cap; larger files upload first and process on the server."}</span></label>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2"><span className="text-xs font-black text-muted-foreground">{ar ? "المادة المرتبطة (اختياري)" : "Related course (optional)"}</span><select value={courseId} onChange={e => setCourseId(e.target.value)} className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm font-bold"><option value="">{ar ? "كل المواد" : "All courses"}</option>{courseOptions.map(course => <option key={course.id} value={course.id}>{course.code ? `${course.code} — ` : ""}{course.name_ar || course.id}</option>)}</select></label>
          <label className="space-y-2"><span className="text-xs font-black text-muted-foreground">{ar ? "التخصص المرتبط (اختياري)" : "Related major (optional)"}</span><select value={majorKey} onChange={e => setMajorKey(e.target.value)} className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm font-bold"><option value="">{ar ? "كل التخصصات" : "All majors"}</option>{majorOptions.map(major => <option key={major} value={major}>{major}</option>)}</select></label>
        </div>
        <label className="block space-y-2"><span className="text-xs font-black text-muted-foreground">{ar ? "محتوى المصدر الذي سيقرأه البوت" : "Knowledge content used by the bot"}</span><textarea value={content} onChange={e => setContent(e.target.value)} rows={8} className="w-full resize-y rounded-2xl border border-border bg-card px-4 py-3 text-sm font-bold leading-6 outline-none focus:border-primary" placeholder={ar ? "سيُملأ تلقائيًا عند اختيار ملف نصي، ويمكنك تعديله قبل الحفظ..." : "Filled from a text file automatically; you can edit it before saving..."} /></label>
        <div className="flex flex-wrap items-center justify-between gap-3"><label className="flex items-center gap-2 text-sm font-black"><input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="h-4 w-4 accent-primary" />{ar ? "فعّال ويُستخدم في الإجابات" : "Active and used for answers"}</label><button disabled={saving} className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-black text-white disabled:opacity-50"><Plus className="h-4 w-4" />{saving ? (ar ? "جاري الحفظ..." : "Saving...") : (ar ? "إضافة مصدر" : "Add source")}</button></div>
      </form>

      <div className="space-y-3">
        {sources.length === 0 && !loading ? <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center text-sm font-bold text-muted-foreground">{ar ? "لا توجد مصادر معرفة بعد" : "No knowledge sources yet"}</div> : sources.map(source => (
          <article key={source.id} className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-card p-4 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0"><div className="flex items-center gap-2"><FileText className="h-4 w-4 shrink-0 text-cyan-300" /><h5 className="truncate font-black">{source.title}</h5><span className={`rounded-full px-2 py-1 text-[10px] font-black ${source.is_active ? "bg-emerald-400/15 text-emerald-300" : "bg-slate-400/15 text-slate-400"}`}>{source.is_active ? (ar ? "فعّال" : "Active") : (ar ? "متوقف" : "Disabled")}</span></div><p className="mt-1 text-xs font-bold text-muted-foreground">{source.file_name} · {(source.character_count || source.content.length).toLocaleString()} {ar ? "حرف" : "chars"} · {source.processing_status === "processing" ? (ar ? "جارٍ التجهيز" : "Processing") : source.processing_status === "failed" ? (ar ? "فشل التجهيز" : "Processing failed") : (ar ? "جاهز للبحث" : "Ready for search")}</p></div>
            <div className="flex items-center gap-2"><button type="button" onClick={() => toggleSource(source)} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-black hover:bg-white/10"><Power className="h-4 w-4" />{source.is_active ? (ar ? "تعطيل" : "Disable") : (ar ? "تفعيل" : "Enable")}</button>{source.file_url && <a href={source.file_url} target="_blank" rel="noreferrer" className="rounded-xl border border-white/10 bg-white/5 p-2 hover:bg-white/10"><ExternalLink className="h-4 w-4" /></a>}<button type="button" onClick={() => deleteSource(source)} className="rounded-xl border border-red-400/20 bg-red-400/10 p-2 text-red-300 hover:bg-red-400/20"><Trash2 className="h-4 w-4" /></button></div>
          </article>
        ))}
      </div>
    </div>
  );
}
