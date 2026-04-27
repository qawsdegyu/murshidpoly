import { useMemo, useState, memo } from "react";
import { motion } from "framer-motion";
import { Users, Search, Mail, Copy, ExternalLink, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";
import { Input } from "@/components/ui/input";
import { facultyList } from "@/data/facultyData";
import { usePreferences } from "@/contexts/PreferencesContext";
import { cn } from "@/lib/utils";

interface FacultyCardProps {
  faculty: typeof facultyList[0];
  index: number;
  lang: string;
  onCopy: (email: string) => void;
}

const FacultyCard = memo(function FacultyCard({ faculty: f, index: i, lang, onCopy }: FacultyCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: i * 0.02 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group relative overflow-hidden bg-surface/40 dark:bg-surface/5 border border-border/60 dark:border-white/10 backdrop-blur-2xl rounded-2xl p-6 hover:border-accent/30 hover:bg-surface/60 transition-all duration-300"
    >
      <div className="flex items-start gap-5">
        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-accent/20 flex items-center justify-center text-accent font-black text-2xl shrink-0 shadow-lg group-hover:scale-110 transition-transform">
          {f.name.split(" ").filter(n => n.length > 2)[0]?.[0] || "د"}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 group-hover:text-accent transition-colors leading-tight">
            {f.name.startsWith("د.") ? f.name : `د. ${f.name}`}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
            {f.department}
          </p>

          <div className="mt-6 flex flex-col gap-2">
            {f.email ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onCopy(f.email)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-surface/50 dark:bg-surface/10 border border-border dark:border-white/10 hover:border-accent/30 transition-all text-sm group/btn"
                >
                  <Mail className="h-4 w-4 text-accent" />
                  <span className="truncate text-slate-600 dark:text-slate-300 font-medium">{f.email}</span>
                  <Copy className="h-3 w-3 ltr:ml-auto rtl:mr-auto opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                </motion.button>
                
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={`mailto:${f.email}`}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent hover:bg-accent hover:text-white font-bold transition-all text-sm"
                >
                  <ExternalLink className="h-4 w-4" />
                  {lang === "ar" ? "إرسال بريد" : "Send Email"}
                </motion.a>
              </>
            ) : (
              <div className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-dashed border-slate-300 dark:border-white/10 text-slate-400 text-xs text-center">
                {lang === "ar" ? "لا يوجد بيانات تواصل حالياً لهذا الاسم" : "No contact information available for this name"}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Shine Effect */}
      <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/10 opacity-0 group-hover:opacity-40 group-hover:animate-shine pointer-events-none" />
    </motion.article>
  );
});

const Faculty = memo(function Faculty() {
  const { t, lang } = usePreferences();
  const [query, setQuery] = useState("");
  const [dept, setDept] = useState<string>("all");

  const departmentsList = useMemo(() => {
    const depts = new Set(facultyList?.map(f => f.department) || []);
    return Array.from(depts);
  }, []);

  const filtered = useMemo(() => {
    return facultyList.filter(f => {
      const matchesQ = !query ||
        f.name.toLowerCase().includes(query.toLowerCase()) ||
        f.department.toLowerCase().includes(query.toLowerCase());
      const matchesD = dept === "all" || f.department === dept;
      return matchesQ && matchesD;
    });
  }, [query, dept]);

  const copy = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success(lang === "ar" ? "تم نسخ البريد الإلكتروني" : "Email copied to clipboard");
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <PageHeader 
        title={t.faculty.title} 
        subtitle={lang === "ar" ? "دليل أعضاء الهيئة التدريسية في كلية الهندسة التكنولوجية" : "FET/Polytechnic Faculty Directory"} 
        icon={<Users className="h-6 w-6" />} 
      />

      {/* Search + filters */}
      <div className="space-y-6 mb-10">
        <div className="relative group">
          <Search className="absolute top-1/2 -translate-y-1/2 ltr:left-4 rtl:right-4 h-5 w-5 text-slate-400 group-focus-within:text-accent transition-colors" />
          <Input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={lang === "ar" ? "ابحث عن دكتور أو قسم..." : "Search for a doctor or department..."}
            className="ltr:pl-12 rtl:pr-12 h-14 bg-surface/50 dark:bg-surface/10 border-border dark:border-white/10 rounded-2xl text-lg backdrop-blur-xl focus:ring-accent transition-all"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setDept("all")}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-bold transition-all",
              dept === "all" 
                ? "bg-accent text-neutral-950 shadow-[0_10px_20px_-5px_rgba(var(--accent-rgb),0.3)]" 
                : "bg-surface/50 dark:bg-surface/10 border border-border dark:border-white/10 hover:bg-surface/80"
            )}
          >
            {t.faculty.all}
          </button>
          {departmentsList?.map(d => (
            <button
              key={d}
              onClick={() => setDept(d)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
                dept === d 
                  ? "bg-accent text-neutral-950 shadow-[0_10px_20px_-5px_rgba(var(--accent-rgb),0.3)]" 
                  : "bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-white/80"
              )}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered?.map((f, i) => (
          <FacultyCard key={f.id} faculty={f} index={i} lang={lang} onCopy={copy} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-24 bg-surface/30 dark:bg-surface/5 rounded-3xl border border-dashed border-border dark:border-white/10">
          <GraduationCap className="h-16 w-16 text-slate-300 dark:text-slate-800 mx-auto mb-4" />
          <p className="text-xl font-bold text-slate-500">
            {lang === "ar" ? "لا يوجد بيانات تواصل حالياً لهذا الاسم" : "No contact information available for this name"}
          </p>
        </div>
      )}
    </motion.div>
  );
});

export default Faculty;
