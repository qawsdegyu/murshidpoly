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
    <div className="relative min-h-screen overflow-y-auto scrollbar-hide pointer-events-auto pb-20">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 pt-32 md:pt-44 pointer-events-auto transition-all duration-700">
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
            className="mb-6 p-4 md:p-8 rounded-2xl md:rounded-[2.5rem] bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 backdrop-blur-xl relative overflow-hidden group pointer-events-auto"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] -mr-32 -mt-32 rounded-full hidden md:block" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <motion.div 
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 hidden md:flex"
                >
                  <Upload className="w-6 h-6 md:w-8 md:h-8" />
                </motion.div>
                <div className="text-center md:text-start">
                  <h3 className="text-lg md:text-2xl font-black text-slate-900 dark:text-white mb-1.5">
                    {lang === "ar" ? "شاركنا ملفاتك أو تلاخيصك" : "Share your files or summaries"}
                  </h3>
                  <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium max-w-xl">
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
                className="flex items-center gap-3 px-6 py-3 md:px-8 md:py-4 rounded-2xl bg-emerald-500 text-white font-black hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20 text-sm md:text-base"
              >
                <Share2 className="w-5 h-5" />
                {lang === "ar" ? "تواصل معنا" : "Contact Us"}
              </motion.a>
            </div>
          </motion.div>

          {/* Search Bar - Center and Wider */}
          <div className="relative max-w-4xl mx-auto mb-12 pointer-events-auto group">
            <div className="absolute -inset-1 bg-gradient-to-r from-accent/0 via-accent/0 to-accent/0 rounded-2xl blur opacity-0 group-focus-within:opacity-20 group-focus-within:from-accent group-focus-within:to-blue-500 transition-all duration-500" />
            <div className="relative">
              <Search className="absolute top-1/2 -translate-y-1/2 ltr:left-6 rtl:right-6 h-6 w-6 text-muted-foreground group-focus-within:text-accent transition-colors" />
              <Input 
                value={q} 
                onChange={e => setQ(e.target.value)} 
                placeholder={t.vault.search} 
                className="ltr:pl-16 rtl:pr-16 h-14 md:h-20 glass text-lg md:text-xl rounded-[1.5rem] md:rounded-[2rem] border-white/10 shadow-elegant transition-all focus:ring-0 focus:border-accent/50" 
              />
            </div>
          </div>

          {/* Category Tabs - Wrapping */}
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mb-16 pointer-events-auto">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeTab === cat.id;
              return (
                <motion.button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-2.5 px-5 py-3 md:px-6 md:py-4 rounded-xl md:rounded-2xl whitespace-nowrap transition-all border shrink-0 ${
                    isActive 
                      ? "bg-primary text-primary-foreground border-transparent shadow-[0_0_25px_rgba(16,185,129,0.3)] scale-105 z-10" 
                      : "glass hover:bg-white/10 border-white/5 text-muted-foreground"
                  }`}
                >
                  <Icon className={`h-4 w-4 md:h-5 md:w-5 ${isActive ? "text-primary-foreground" : "text-accent"}`} />
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

          {/* Course Grid - Responsive Columns */}
          <div className="space-y-16 min-h-[400px] pointer-events-auto">
            <AnimatePresence mode="popLayout" initial={false}>
              {groupedData.map((group) => (
                <div key={group.categoryId} className="space-y-8">
                  {activeTab === "all" && (
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-2 rounded-full bg-primary shadow-elegant" />
                      <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white font-['Cairo']">
                        {group.categoryName}
                      </h2>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-10">
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
              className="text-center py-32 pointer-events-auto"
            >
              <div className="h-24 w-24 bg-muted/10 rounded-full grid place-items-center mx-auto mb-6">
                <Search className="h-10 w-10 text-muted-foreground opacity-50" />
              </div>
              <h3 className="text-2xl font-black text-muted-foreground">
                {lang === "ar" ? "لا توجد نتائج مطابقة" : "No results found"}
              </h3>
              <p className="text-sm md:text-base text-muted-foreground/60 mt-3 font-bold">
                {lang === "ar" ? "جرب البحث بكلمة أخرى أو تغيير الفئة" : "Try a different search term or category"}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
