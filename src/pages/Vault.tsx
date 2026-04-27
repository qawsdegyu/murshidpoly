import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, Search, Code2, Shield,
  Banknote, Languages, LayoutGrid,
  Wrench, Flag, Lightbulb, Type, GraduationCap, FileText,
  Share2, Upload
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import CourseCard from "@/components/CourseCard";
import { Input } from "@/components/ui/input";
import { courses, resourcesByCourse } from "@/data/mockData";
import { usePreferences } from "@/contexts/PreferencesContext";

const categories = [
  { id: "all", nameEn: "All", nameAr: "الكل", icon: LayoutGrid },
  { id: "engineering", nameEn: "Engineering & Programming", nameAr: "العلوم الهندسية والبرمجية", icon: Code2 },
  { id: "humanities", nameEn: "Humanities & Economics", nameAr: "المتطلبات الإنسانية والاقتصادية", icon: Banknote },
  { id: "languages", nameEn: "Languages & Communication", nameAr: "اللغات والتواصل", icon: Languages },
  { id: "military_islamic", nameEn: "Military & Islamic Sciences", nameAr: "العلوم العسكرية والإسلامية", icon: Shield },
];

const courseCategoryMap: Record<string, string> = {
  programming_cpp: "engineering",
  engineering_workshop: "engineering",
  national_studies: "humanities",
  entrepreneurship: "humanities",
  ee201: "humanities",
  english101: "languages",
  english102: "languages",
  applied_arabic: "languages",
  military_science: "military_islamic",
  islamic_culture: "military_islamic",
  // Adding others from mockData just in case, but user only specified these
  c6: "engineering", // Calculus 1
  c2: "engineering", // Calculus 2
  p101: "engineering", // Physics 1
  p102: "engineering", // Physics 2
  chem101: "engineering", // Chemistry
  stat101: "humanities", // Stats
  isl101: "military_islamic", // Islam & Life
};

const courseIcons: Record<string, any> = {
  programming_cpp: Code2,
  engineering_workshop: Wrench,
  national_studies: Flag,
  entrepreneurship: Lightbulb,
  ee201: Banknote,
  english101: Languages,
  english102: Languages,
  applied_arabic: Type,
  military_science: Shield,
  islamic_culture: GraduationCap,
  c6: BookOpen,
  c2: BookOpen,
  p101: Shield,
  p102: Shield,
  chem101: BookOpen,
  stat101: FileText,
  isl101: GraduationCap,
};

export default function Vault() {
  const { t, lang, dir } = usePreferences();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [q, setQ] = useState("");
  const activeTab = searchParams.get("category") || "all";

  const setActiveTab = (id: string) => {
    if (id === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", id);
    }
    setSearchParams(searchParams);
  };

  const filtered = useMemo(() => {
    return courses.filter(c => {
      const category = courseCategoryMap[c.id] || "other";
      const hasFiles = resourcesByCourse[c.id] && resourcesByCourse[c.id].length > 0;
      
      // Rule: Strict data cleanup - remove subjects without files
      if (!hasFiles) return false;

      const matchesSearch = !q || 
        c.name.toLowerCase().includes(q.toLowerCase()) || 
        c.nameAr.includes(q) || 
        c.code.toLowerCase().includes(q.toLowerCase());
      
      const matchesCategory = activeTab === "all" || category === activeTab;

      return matchesSearch && matchesCategory;
    });
  }, [q, activeTab]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="pb-20"
    >
      <PageHeader 
        title={t.vault.title} 
        subtitle={t.vault.subtitle} 
        icon={<BookOpen className="h-6 w-6" />} 
      />

      {/* ── Contribute Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.01 }}
        className="mb-8 p-5 md:p-8 rounded-3xl md:rounded-[2.5rem] bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 backdrop-blur-xl relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] -mr-32 -mt-32 rounded-full" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <motion.div 
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0"
            >
              <Upload className="w-6 h-6 md:w-7 md:h-7" />
            </motion.div>
            <div className="text-center md:text-start">
              <h3 className="text-lg md:text-xl font-black text-white mb-1">
                {lang === "ar" ? "شاركنا ملفاتك أو تلاخيصك" : "Share your files or summaries"}
              </h3>
              <p className="text-sm text-slate-400 font-medium max-w-md">
                {lang === "ar" 
                  ? "ساعد زملائك من خلال مشاركة مصادرك الدراسية في خزانة مرشد." 
                  : "Help your colleagues by sharing your study resources in Murshid's Vault."}
              </p>
            </div>
          </div>

          <motion.a
            href="https://api.whatsapp.com/send?phone=962785159906&text=مرحباً%20مرشد،%20أريد%20مشاركة%20ملفات%20لمادة:%20"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 px-6 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl bg-emerald-500 text-white font-black hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            {lang === "ar" ? "تواصل معنا" : "Contact Us"}
          </motion.a>
        </div>
      </motion.div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <Search className="absolute top-1/2 -translate-y-1/2 ltr:left-4 rtl:right-4 h-5 w-5 text-muted-foreground" />
        <Input 
          value={q} 
          onChange={e => setQ(e.target.value)} 
          placeholder={t.vault.search} 
          className="ltr:pl-12 rtl:pr-12 h-12 md:h-14 glass text-sm md:text-lg rounded-xl md:rounded-2xl border-white/10 shadow-elegant transition-all focus:ring-2 focus:ring-primary/20" 
        />
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-10 overflow-x-auto pb-2 scrollbar-hide">
        {categories?.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeTab === cat.id;
          return (
            <motion.button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-2 px-4 py-2.5 md:px-5 md:py-3 rounded-xl md:rounded-2xl whitespace-nowrap transition-all border ${
                isActive 
                  ? "gradient-primary text-primary-foreground border-transparent shadow-gold" 
                  : "glass hover:bg-white/10 border-white/5 text-muted-foreground"
              }`}
            >
              <Icon className={`h-3 w-3 md:h-3.5 md:w-3.5 ${isActive ? "text-white" : "text-primary dark:text-accent"}`} />
              <span className="font-bold text-xs md:text-sm">{lang === "ar" ? cat.nameAr : cat.nameEn}</span>
              {isActive && (
                <motion.div 
                  layoutId="activeTabGlow"
                  className="absolute inset-0 bg-primary/20 blur-xl -z-10 rounded-2xl"
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Course Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filtered?.map((c, i) => (
            <CourseCard
              key={c.id}
              course={c}
              index={i}
              onClick={() => navigate(`/materials/${c.id}`)}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <div className="h-20 w-20 bg-muted/20 rounded-full grid place-items-center mx-auto mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold text-muted-foreground">
            {lang === "ar" ? "لا توجد نتائج مطابقة" : "No results found"}
          </h3>
          <p className="text-sm text-muted-foreground/60 mt-2">
            {lang === "ar" ? "جرب البحث بكلمة أخرى أو تغيير الفئة" : "Try a different search term or category"}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
