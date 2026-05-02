import { useMemo, useState, memo, useCallback, useDeferredValue } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Search, GraduationCap, X } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";
import DoctorCard from "@/components/DoctorCard";
import { Input } from "@/components/ui/input";
import { facultyList } from "@/data/facultyData";
import { usePreferences } from "@/contexts/PreferencesContext";
import { cn } from "@/lib/utils";

/* ─── Faculty Page ─── */

const Faculty = memo(function Faculty() {
  const { t, lang } = usePreferences();
  const [query, setQuery] = useState("");
  const [dept, setDept] = useState<string>("all");
  const [isGrouped, setIsGrouped] = useState(true);
  const [expandedDoctorId, setExpandedDoctorId] = useState<string | null>(null);

  // Defer the filtered list to prevent typing lag
  const deferredQuery = useDeferredValue(query);
  const deferredDept = useDeferredValue(dept);

  const departmentsList = useMemo(() => {
    const depts = new Set(facultyList?.map(f => f.department) || []);
    return Array.from(depts).sort();
  }, []);

  const filtered = useMemo(() => {
    const q = deferredQuery.toLowerCase().trim();
    const list = facultyList.filter(f => {
      const matchesQ = !q ||
        f.name.toLowerCase().includes(q) ||
        f.department.toLowerCase().includes(q) ||
        (f.email && f.email.toLowerCase().includes(q));
      const matchesD = deferredDept === "all" || f.department === deferredDept;
      return matchesQ && matchesD;
    });

    const seen = new Set();
    return list.filter(f => {
      const key = f.email || f.name;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [deferredQuery, deferredDept]);

  const copy = useCallback((text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success(lang === "ar" ? "تم نسخ البريد الإلكتروني" : "Email copied to clipboard");
  }, [lang]);

  const toggleExpand = useCallback((id: string) => {
    setExpandedDoctorId(prev => (prev === id ? null : id));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="max-w-[1440px] mx-auto px-4 md:px-8 pt-28 pb-10"
    >
      <PageHeader
        title={t.faculty.title}
        subtitle={lang === "ar" ? "دليل أعضاء الهيئة التدريسية في كلية الهندسة التكنولوجية" : "FET/Polytechnic Faculty Directory"}
        icon={<Users className="h-6 w-6" />}
      />

      {/* Search + filters */}
      <div className="space-y-6 mb-10">
        <div className="relative group">
          <Search className="absolute top-1/2 -translate-y-1/2 ltr:left-4 rtl:right-4 h-5 w-5 text-muted-foreground group-focus-within:text-accent transition-colors" />
          <Input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={lang === "ar" ? "ابحث عن دكتور أو قسم..." : "Search for a doctor or department..."}
            className="ltr:pl-12 rtl:pr-12 h-14 bg-surface/50 border-border rounded-2xl text-lg backdrop-blur-xl focus:ring-accent transition-all"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setDept("all")}
            className={cn(
              "px-5 py-2.5 rounded-2xl text-xs md:text-sm font-black transition-all",
              dept === "all"
                ? "bg-accent text-accent-foreground shadow-lg shadow-accent/20"
                : "bg-surface/50 border border-border hover:bg-surface/80"
            )}
          >
            {t.faculty.all}
          </button>
          {departmentsList?.map(d => (
            <button
              key={d}
              onClick={() => setDept(d)}
              className={cn(
                "px-5 py-2.5 rounded-2xl text-xs md:text-sm font-black transition-all",
                dept === d
                  ? "bg-accent text-accent-foreground shadow-lg shadow-accent/20"
                  : "bg-surface/50 border border-border hover:bg-surface/80"
              )}
            >
              {d}
            </button>
          ))}
        </div>

      </div>

      {/* Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        <AnimatePresence mode="popLayout">
          {filtered?.map((f, i) => (
            <DoctorCard
              key={f.id}
              faculty={f}
              index={i}
              lang={lang}
              isExpanded={expandedDoctorId === f.id}
              onToggle={toggleExpand}
              onCopy={copy}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <div className="text-center py-24 bg-surface/30 rounded-3xl border border-dashed border-border">
          <GraduationCap className="h-16 w-16 text-content/20 mx-auto mb-4" />
          <p className="text-xl font-bold text-content/40">
            {lang === "ar" ? "لا يوجد بيانات تواصل حالياً لهذا الاسم" : "No contact information available for this name"}
          </p>
        </div>
      )}
    </motion.div>
  );
});

export default Faculty;
