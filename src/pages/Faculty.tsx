import React, { useMemo, useState, memo, useCallback, useDeferredValue, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Search, GraduationCap, X } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import DoctorCard from "@/components/DoctorCard";
import { Input } from "@/components/ui/input";
import { facultyList } from "@/data/facultyData";
import { usePreferences } from "@/contexts/PreferencesContext";
import { useAuth } from "@/contexts/AuthContext";
import { cn, advancedSearchMatch } from "@/lib/utils";
import DoctorDetailModal from "@/components/DoctorDetailModal";
import { supabase } from "@/lib/supabase";
import { Edit, Trash2, Plus, Save } from "lucide-react";
import { isUserAdmin } from "@/lib/admin";
import DoctorListSkeleton from "@/components/skeletons/DoctorListSkeleton";
import ShareButton from "@/components/ShareButton";
import ErrorBoundary from "@/components/ErrorBoundary";

// Allowed admin emails
const Faculty = memo(function Faculty() {
  const { t, lang } = usePreferences();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [dept, setDept] = useState<string>("all");
  const [isGrouped, setIsGrouped] = useState(true);
  const [expandedDoctorId, setExpandedDoctorId] = useState<string | null>(null);
  const [professors, setProfessors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Admin State
  const isAdmin = isUserAdmin(user?.email);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<any>(null);

  // Fetch Professors from Supabase
  useEffect(() => {
    const fetchProfessors = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("professors")
        .select("*")
        .order("name_ar", { ascending: true });

      if (error) {
        console.error("Error fetching professors:", error);
        toast.error(lang === "ar" ? "فشل في جلب بيانات الدكاترة" : "Failed to load professors");
      } else {
        // Map data to match the expected structure in components
        const normalizeDepartment = (dept: string) => {
          if (!dept) return "";
          const d = dept.toLowerCase().trim();
          switch (d) {
            case "mechanical": return "قسم الهندسة الميكانيكية";
            case "civil": return "قسم الهندسة المدنية";
            case "chemical": return "قسم الهندسة الكيميائية";
            case "electrical": 
            case "computer": 
            case "قسم هندسة الحاسوب": 
              return "قسم الهندسة الكهربائية";
            case "mechatronics": return "قسم هندسة الميكاترونكس";
            case "industrial": return "قسم الهندسة الصناعية";
            case "autotronics": return "قسم هندسة الأوتوترونكس";
            case "telecom": return "قسم هندسة الاتصالات";
            case "network-security": return "قسم هندسة أمن الشبكات والسيبراني";
            case "basic-sciences": return "قسم العلوم الأساسية العلمية";
            case "general-requirements":
            case "general":
              return "قسم العلوم الأساسية الإنسانية";
            default: return dept;
          }
        };

        const mappedData = (data || []).map(p => ({
          ...p,
          department: normalizeDepartment(p.department),
          name: lang === "ar" ? (p.name_ar || p.name_en) : (p.name_en || p.name_ar),
          rank: lang === "ar" ? (p.rank_ar || p.rank) : (p.rank || p.rank_ar),
          hours: p.office_hours || p.officeHours || "-",
          email: p.email || "-",
          profileUrl: p.profile_url,
          buildingId: p.building_id,
          subjects: p.subjects
        }));
        setProfessors(mappedData);
      }
      setIsLoading(false);
    };

    fetchProfessors();
  }, [lang]);

  // Defer the filtered list to prevent typing lag
  const deferredQuery = useDeferredValue(query);
  const deferredDept = useDeferredValue(dept);

  const departmentsList = useMemo(() => {
    const depts = new Set(professors?.map(f => f.department) || []);
    return Array.from(depts).filter(Boolean).sort();
  }, [professors]);

  const filtered = useMemo(() => {
    const list = professors.filter(f => {
      const matchesQ = advancedSearchMatch(deferredQuery, f.name, f.department, f.email, f.subjects);
      const matchesD = deferredDept === "all" || f.department === deferredDept;
      return matchesQ && matchesD;
    });

    const seen = new Set();
    return list.filter(f => {
      const key = f.id || f.email || f.name;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [deferredQuery, deferredDept, professors]);

  const copy = useCallback((text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success(lang === "ar" ? "تم نسخ البريد الإلكتروني" : "Email copied to clipboard");
  }, [lang]);

  const toggleExpand = useCallback((id: string) => {
    setExpandedDoctorId(prev => (prev === id ? null : id));
  }, []);

  const selectedDoctor = useMemo(() => {
    return professors.find(f => f.id === expandedDoctorId) || null;
  }, [expandedDoctorId, professors]);

  const handleEdit = useCallback((e: React.MouseEvent, doc: any) => {
    e.stopPropagation();
    e.preventDefault();
    // Navigate to admin page with the professor ID pre-selected for editing
    navigate(`/admin?tab=professors&edit=${doc.id}`);
  }, [navigate]);

  const handleDelete = useCallback(async (e: React.MouseEvent, id: string, name?: string) => {
    e.stopPropagation();
    e.preventDefault();
    if (!confirm(lang === "ar" ? `هل أنت متأكد من حذف "${name || id}"؟` : `Are you sure you want to delete "${name || id}"?`)) return;

    const { error } = await supabase.from("professors").delete().eq("id", id);
    if (error) {
      toast.error(lang === "ar" ? "فشل الحذف" : "Delete failed");
    } else {
      toast.success(lang === "ar" ? "تم حذف الدكتور بنجاح ✓" : "Professor deleted successfully ✓");
      setProfessors(prev => prev.filter(p => p.id !== id));
    }
  }, [lang]);

  if (isLoading) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 pt-6 md:pt-8 pb-10">
        <div className="flex items-center justify-between gap-4 mb-6">
          <PageHeader
            title={t.faculty.title}
            subtitle={lang === "ar" ? "دليل أعضاء الهيئة التدريسية في كلية الهندسة التكنولوجية" : "FET/Polytechnic Faculty Directory"}
            icon={<Users className="h-6 w-6" />}
            className="mb-0"
          />
        </div>
        <DoctorListSkeleton />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen w-full bg-gradient-to-b from-[#F8FAFC] dark:from-[#0B1220] via-[#F8FAFC] dark:via-[#111827] to-[#F1F5F9] dark:to-[#0F172A]"
    >
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 pt-6 md:pt-8 pb-10">
      <div className="flex items-center justify-between gap-4 mb-6">
        <PageHeader
          title={t.faculty.title}
          subtitle={lang === "ar" ? "دليل أعضاء الهيئة التدريسية في كلية الهندسة التكنولوجية" : "FET/Polytechnic Faculty Directory"}
          icon={<Users className="h-6 w-6" />}
          className="mb-0"
        />
        <div className="flex items-center gap-3">
        </div>
      </div>

      {/* Search + filters + Admin Add */}
      <div className="space-y-6 mb-10">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative group flex-1">
            <Search className="absolute top-1/2 -translate-y-1/2 ltr:left-4 rtl:right-4 h-5 w-5 text-[#64748B] group-focus-within:text-[#14B8A6] transition-colors" />
            <Input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={lang === "ar" ? "ابحث عن دكتور أو قسم..." : "Search for a doctor or department..."}
              className="ltr:pl-12 rtl:pr-12 h-14 bg-[#F8FAFC] dark:bg-[#1E293B] border-[#E2E8F0] dark:border-[#334155] text-[#0F172A] dark:text-[#F8FAFC] placeholder:text-[#64748B] dark:placeholder:text-[#64748B] rounded-2xl text-lg focus:border-[#5EEAD4] dark:focus:border-[#14B8A6] focus:ring-0 transition-all w-full"
            />
          </div>
        </div>

        <div className="hidden md:flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setDept("all")}
            className={cn(
              "px-5 py-2.5 rounded-2xl text-xs md:text-sm font-black transition-all",
              dept === "all"
                ? "bg-[#14B8A6] dark:bg-[#14B8A6] text-[#F8FAFC] dark:text-[#0B1220] shadow-sm"
                : "bg-[#F1F5F9] dark:bg-[#0F172A] border border-[#CBD5E1] dark:border-[#334155] text-[#64748B] dark:text-[#94A3B8] hover:bg-[#E2E8F0] dark:hover:bg-[#1E293B] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]"
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
                  ? "bg-[#14B8A6] dark:bg-[#14B8A6] text-[#F8FAFC] dark:text-[#0B1220] shadow-sm"
                  : "bg-[#F1F5F9] dark:bg-[#0F172A] border border-[#CBD5E1] dark:border-[#334155] text-[#64748B] dark:text-[#94A3B8] hover:bg-[#E2E8F0] dark:hover:bg-[#1E293B] hover:text-[#0F172A] dark:hover:text-[#F8FAFC]"
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
            <div key={f.id} className="relative group/admin">
              <DoctorCard
                faculty={f}
                index={i}
                lang={lang}
                isExpanded={expandedDoctorId === f.id}
                onToggle={toggleExpand}
                onCopy={copy}
              />
              {/* Admin quick-action buttons — show on hover */}
              {isAdmin && (
                <div className="absolute top-3 ltr:right-3 rtl:left-3 flex gap-1.5 opacity-0 group-hover/admin:opacity-100 transition-all duration-200 z-20">
                  <button
                    onClick={(e) => handleEdit(e, f)}
                    title={lang === "ar" ? "تعديل" : "Edit"}
                    className="w-8 h-8 rounded-xl bg-blue-500 text-white flex items-center justify-center shadow-lg hover:bg-blue-600 hover:scale-110 transition-all">
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, f.id, lang === "ar" ? f.name_ar : f.name_en)}
                    title={lang === "ar" ? "حذف" : "Delete"}
                    className="w-8 h-8 rounded-xl bg-red-500 text-white flex items-center justify-center shadow-lg hover:bg-red-600 hover:scale-110 transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
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

      <AnimatePresence>
        {selectedDoctor && (
          <DoctorDetailModal
            faculty={selectedDoctor}
            isOpen={!!selectedDoctor}
            onClose={() => setExpandedDoctorId(null)}
            lang={lang}
            onCopy={copy}
          />
        )}
      </AnimatePresence>

      </div>
    </motion.div>
  );
});

export default function FacultyPage() {
  return (
    <ErrorBoundary>
      <Faculty />
    </ErrorBoundary>
  );
}
