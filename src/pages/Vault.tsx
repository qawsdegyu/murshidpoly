import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, Search, Code2, Shield,
  Banknote, Languages, LayoutGrid,
  Wrench, Flag, Lightbulb, Type, GraduationCap, FileText,
  Share2, Upload, FlaskConical, Calculator
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import CourseCard from "@/components/CourseCard";
import { Input } from "@/components/ui/input";
import { courses, resourcesByCourse } from "@/data/mockData";
import { usePreferences } from "@/contexts/PreferencesContext";

const categories = [
  { id: "all", nameEn: "All", nameAr: "الكل", icon: LayoutGrid },
  { id: "math", nameEn: "Engineering Math", nameAr: "الرياضيات الهندسية المشتركة", icon: Calculator },
  { id: "physics", nameEn: "Physics & Engineering", nameAr: "فيزياء وهندسة أساسية", icon: Shield },
  { id: "chemistry", nameEn: "Chemistry", nameAr: "مواد الكيمياء", icon: FlaskConical },
  { id: "computing", nameEn: "Computing & Practical", nameAr: "حاسوب وهندسة عملية", icon: Code2 },
  { id: "support", nameEn: "Engineering Support", nameAr: "مواد مساندة هندسية", icon: Banknote },
  { id: "culture", nameEn: "General Culture", nameAr: "ثقافة عامة", icon: Flag },
  { id: "arabic", nameEn: "Arabic Language", nameAr: "اللغة العربية", icon: Type },
  { id: "skills", nameEn: "Skills & Development", nameAr: "المهارات والتطوير", icon: Lightbulb },
  { id: "english", nameEn: "English Language", nameAr: "اللغة الإنجليزية", icon: Languages },
];

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

  const groupedData = useMemo(() => {
    const baseFiltered = courses.filter(c => {
      const hasFiles = resourcesByCourse[c.id] && resourcesByCourse[c.id].length > 0;
      if (!hasFiles) return false;

      const matchesSearch = !q || 
        c.name.toLowerCase().includes(q.toLowerCase()) || 
        c.nameAr.includes(q) || 
        c.code.toLowerCase().includes(q.toLowerCase());
      
      const matchesCategory = activeTab === "all" || c.category === activeTab;

      return matchesSearch && matchesCategory;
    });

    if (activeTab !== "all") {
      return [{ categoryId: activeTab, courses: baseFiltered }];
    }

    // Group by category if 'All' is selected
    const groups: Record<string, typeof courses> = {};
    baseFiltered.forEach(c => {
      const catId = c.category || "other";
      if (!groups[catId]) groups[catId] = [];
      groups[catId].push(c);
    });

    return categories
      .filter(cat => cat.id !== "all" && groups[cat.id])
      .map(cat => ({
        categoryId: cat.id,
        categoryName: lang === "ar" ? cat.nameAr : cat.nameEn,
        courses: groups[cat.id]
      }));
  }, [q, activeTab, lang]);

  return (
    <div
      className="relative min-h-screen overflow-y-auto scrollbar-hide pointer-events-auto pb-20"
    >

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 pt-32 md:pt-44 pointer-events-auto transition-all duration-700">
        <PageHeader 
          title={t.vault.title} 
          subtitle={t.vault.subtitle} 
          icon={<BookOpen className="h-10 w-10 md:h-14 md:w-14 text-accent" />} 
          className="mb-10"
        />
        
        <div className="space-y-12">

      {/* ── Contribute Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 p-4 md:p-6 rounded-2xl md:rounded-[2rem] bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 backdrop-blur-xl relative overflow-hidden group pointer-events-auto"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] -mr-32 -mt-32 rounded-full hidden md:block" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <motion.div 
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              style={{ willChange: "transform" }}
              className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 hidden md:flex"
            >
              <Upload className="w-5 h-5 md:w-6 md:h-6" />
            </motion.div>
            <div className="text-center md:text-start">
              <h3 className="text-[15px] md:text-lg font-black text-slate-900 dark:text-white mb-0.5">
                {lang === "ar" ? "شاركنا ملفاتك أو تلاخيصك" : "Share your files or summaries"}
              </h3>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 font-medium max-w-md">
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
            style={{ willChange: "transform" }}
            className="flex items-center gap-2.5 px-5 py-2.5 md:px-6 md:py-3 rounded-xl bg-emerald-500 text-white font-black hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 text-xs md:text-sm"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 md:w-5 md:h-5 fill-current">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            {lang === "ar" ? "تواصل معنا" : "Contact Us"}
          </motion.a>
        </div>
      </motion.div>

      {/* Search Bar */}
      <div className="relative max-w-2xl mx-auto mb-10 pointer-events-auto group">
        <div className="absolute -inset-1 bg-gradient-to-r from-accent/0 via-accent/0 to-accent/0 rounded-2xl blur opacity-0 group-focus-within:opacity-30 group-focus-within:from-accent group-focus-within:to-blue-500 transition-all duration-500" />
        <div className="relative">
          <Search className="absolute top-1/2 -translate-y-1/2 ltr:left-5 rtl:right-5 h-5 w-5 text-muted-foreground group-focus-within:text-accent transition-colors" />
          <Input 
            value={q} 
            onChange={e => setQ(e.target.value)} 
            placeholder={t.vault.search} 
            className="ltr:pl-14 rtl:pr-14 h-12 md:h-16 glass text-base md:text-lg rounded-2xl border-white/10 shadow-elegant transition-all focus:ring-0 focus:border-accent/50" 
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-12 pointer-events-auto">
        {categories?.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeTab === cat.id;
          return (
            <motion.button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2.5 px-5 py-3.5 rounded-2xl whitespace-nowrap transition-all border shrink-0 ${
                isActive 
                  ? "gradient-primary text-primary-foreground border-transparent shadow-[0_0_25px_rgba(16,185,129,0.3)] scale-105 z-10" 
                  : "glass hover:bg-white/10 border-white/5 text-muted-foreground"
              }`}
            >
              <Icon className={`h-4.5 w-4.5 ${isActive ? "text-primary-foreground" : "text-primary dark:text-accent"}`} />
              <span className="font-black text-xs md:text-sm tracking-wide">{lang === "ar" ? cat.nameAr : cat.nameEn}</span>
              {isActive && (
                <motion.div 
                  layoutId="activeTabGlow"
                  className="absolute inset-0 bg-primary/20 blur-2xl -z-10 rounded-2xl"
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Course Grid */}
      <div className="space-y-12 min-h-[400px] pointer-events-auto">
        <AnimatePresence mode="popLayout" initial={false}>
          {groupedData.map((group) => (
            <div key={group.categoryId} className="space-y-6">
              {activeTab === "all" && (
                <div className="flex items-center gap-3">
                  <div className="h-8 w-1.5 rounded-full bg-primary shadow-elegant" />
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
                    {group.categoryName}
                  </h2>
                </div>
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
                {group.courses.map((c, i) => {
                  const categoryObj = categories.find(cat => cat.id === (c.category || "math"));
                  const Icon = categoryObj?.icon || BookOpen;
                  
                  return (
                    <CourseCard
                      key={c.id}
                      course={c}
                      index={i}
                      icon={<Icon className="h-5 w-5" />}
                      onClick={() => navigate(`/materials/${c.id}`)}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </AnimatePresence>
      </div>

      {groupedData.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 pointer-events-auto"
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
      </div>
      </div>
    </div>
  );
}
