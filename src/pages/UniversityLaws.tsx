import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Gavel, Search, BookOpen, GraduationCap, 
  FileText, Copy, Check, Download, 
  ChevronRight, ChevronLeft, Library, Info
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { Input } from "@/components/ui/input";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { usePreferences } from "@/contexts/PreferencesContext";
import { universityLaws } from "@/data/universityLaws";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function UniversityLaws() {
  const { lang, t } = usePreferences();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [copied, setCopied] = useState(false);
  const itemsPerPage = 10;

  const filteredLaws = useMemo(() => {
    if (!searchQuery) return universityLaws;
    const q = searchQuery.toLowerCase();
    return universityLaws.map(section => ({
      ...section,
      questions: section.questions.filter(qu => 
        qu.question.toLowerCase().includes(q) || 
        qu.answer.toLowerCase().includes(q)
      )
    })).filter(section => section.questions.length > 0);
  }, [searchQuery]);

  const allQuestions = useMemo(() => {
    const flattened: any[] = [];
    filteredLaws.forEach(section => {
      section.questions.forEach(q => {
        flattened.push({ ...q, sectionTitle: section.title });
      });
    });
    return flattened;
  }, [filteredLaws]);

  // Reset page when searching
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.ceil(allQuestions.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentQuestions = allQuestions.slice(indexOfFirstItem, indexOfLastItem);

  const copyToClipboard = () => {
    const text = universityLaws.map(section => 
      `◆ ${section.title}\n\n` + 
      section.questions.map(q => `س: ${q.question}\n✅ ${q.answer}`).join('\n\n')
    ).join('\n\n' + '─'.repeat(30) + '\n\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success(lang === 'ar' ? 'تم نسخ بنك الأسئلة للمحفظة' : 'Q&A bank copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="relative min-h-screen overflow-y-auto pb-20 pt-0 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto">
      <PageHeader
        title={lang === 'ar' ? 'قانون الجامعات الأردنية' : 'Jordanian Universities Law'}
        subtitle={lang === 'ar' 
          ? 'بنك أسئلة وأجوبة شامل لقانون الجامعات الأردنية رقم (18) لسنة 2018 وتعديلاته، مصمم لمساعدة الطلاب وفهم الأنظمة الأكاديمية.' 
          : 'A comprehensive Q&A bank for the Jordanian Universities Law No. (18) of 2018 and its amendments.'}
        icon={<Gavel className="h-10 w-10 text-accent" />}
        actions={
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={copyToClipboard}
            className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-xl text-sm font-bold hover:bg-accent/5 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4 text-accent" />}
            {lang === 'ar' ? 'نسخ البيانات' : 'Copy Data'}
          </motion.button>
        }
      />

      {/* Hero Stats/Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 mt-8">
        {[
          { 
            icon: <Library className="w-5 h-5 text-blue-500" />, 
            label: lang === 'ar' ? 'رقم القانون' : 'Law Number', 
            value: '18 لسنة 2018' 
          },
          { 
            icon: <Info className="w-5 h-5 text-accent" />, 
            label: lang === 'ar' ? 'آخر تعديل' : 'Last Amendment', 
            value: '2019' 
          },
          { 
            icon: <GraduationCap className="w-5 h-5 text-success" />, 
            label: lang === 'ar' ? 'إجمالي الأسئلة' : 'Total Questions', 
            value: `${allQuestions.length} سؤال` 
          }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-4 rounded-2xl bg-surface/50 border border-border/50 flex items-center gap-4 shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-background border border-border/30 flex items-center justify-center">
              {stat.icon}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground opacity-60">
                {stat.label}
              </p>
              <p className="text-sm font-black text-foreground">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search Section */}
      <div className="relative mb-12 group max-w-2xl">
        <div className="absolute inset-y-0 ltr:left-4 rtl:right-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-accent transition-colors" />
        </div>
        <Input
          type="text"
          placeholder={lang === 'ar' ? 'ابحث في نصوص القانون...' : 'Search law articles...'}
          className="ltr:pl-12 rtl:pr-12 h-14 bg-surface/80 border-border shadow-elegant rounded-2xl text-lg font-medium focus:ring-accent/20 transition-all"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Laws Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Navigation Sidebar (Desktop) - Hide when searching or if few results */}
        {!searchQuery && (
          <div className="hidden lg:block lg:col-span-3 space-y-2 sticky top-48 self-start">
            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4 px-2">
              {lang === 'ar' ? 'فهرس الأقسام' : 'Sections Menu'}
            </h3>
            {universityLaws.map((section, idx) => (
              <button
                key={idx}
                onClick={() => {
                  // Since we have pagination, scrolling to section might need to go to specific page
                  // For now, keep it simple or just scroll if visible
                  const el = document.getElementById(`section-${idx}`);
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  else toast.info(lang === 'ar' ? 'هذا القسم في صفحة أخرى' : 'This section is on another page');
                }}
                className="w-full text-start px-4 py-3 rounded-xl hover:bg-surface border border-transparent hover:border-border/50 transition-all group flex items-center gap-3"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-accent/30 group-hover:bg-accent transition-colors" />
                <span className="text-sm font-bold text-foreground/70 group-hover:text-foreground transition-colors truncate">
                  {section.title}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Accordion List */}
        <motion.div 
          className={cn("space-y-8", searchQuery ? "lg:col-span-12" : "lg:col-span-9")}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {currentQuestions.length > 0 ? (
            <div className="space-y-4">
              <Accordion type="single" collapsible className="w-full space-y-4">
                <AnimatePresence mode="popLayout">
                  {currentQuestions.map((q, idx) => (
                    <motion.div
                      key={q.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <AccordionItem 
                        value={q.id}
                        className="border border-border/50 bg-surface/30 rounded-2xl px-4 overflow-hidden hover:border-accent/30 transition-colors duration-300"
                      >
                        <AccordionTrigger className="hover:no-underline py-4 text-start group">
                          <div className="flex flex-col gap-2 w-full">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black uppercase tracking-widest text-accent bg-accent/5 px-2 py-0.5 rounded-md border border-accent/10">
                                {q.sectionTitle}
                              </span>
                            </div>
                            <div className="flex items-start gap-4">
                              <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent text-xs font-black">
                                {idx + 1 + (currentPage - 1) * itemsPerPage}
                              </span>
                              <span className="text-sm md:text-base font-bold text-foreground/90 group-hover:text-foreground leading-relaxed">
                                {q.question}
                              </span>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-6 pt-2">
                          <div className="ltr:ml-12 rtl:mr-12 p-4 rounded-xl bg-background/50 border border-border/30 relative overflow-hidden">
                            <div className="absolute top-0 ltr:left-0 rtl:right-0 w-1 h-full bg-success/50" />
                            <p className="text-sm md:text-base text-muted-foreground font-bold leading-relaxed whitespace-pre-wrap">
                              {q.answer}
                            </p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </Accordion>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex flex-col items-center gap-6 pt-12">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setCurrentPage(prev => Math.max(1, prev - 1));
                        window.scrollTo({ top: 400, behavior: 'smooth' });
                      }}
                      disabled={currentPage === 1}
                      className="p-3 rounded-xl bg-surface border border-border text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronRight className={cn("w-5 h-5", lang === 'ar' ? "" : "rotate-180")} />
                    </button>

                    <div className="flex items-center gap-1.5 px-3 overflow-x-auto max-w-[200px] md:max-w-none no-scrollbar">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                        const isActive = currentPage === page;
                        return (
                          <button
                            key={page}
                            onClick={() => {
                              setCurrentPage(page);
                              window.scrollTo({ top: 400, behavior: 'smooth' });
                            }}
                            className={cn(
                              "min-w-[40px] h-10 rounded-xl font-black text-sm transition-all shrink-0",
                              isActive
                                ? "bg-accent text-accent-foreground shadow-lg shadow-accent/20 scale-110"
                                : "bg-surface border border-border text-muted-foreground hover:border-accent/40"
                            )}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => {
                        setCurrentPage(prev => Math.min(totalPages, prev + 1));
                        window.scrollTo({ top: 400, behavior: 'smooth' });
                      }}
                      disabled={currentPage === totalPages}
                      className="p-3 rounded-xl bg-surface border border-border text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft className={cn("w-5 h-5", lang === 'ar' ? "" : "rotate-180")} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-20 bg-surface/30 rounded-3xl border border-dashed border-border">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
              <h3 className="text-xl font-black text-foreground/50">
                {lang === 'ar' ? 'لا يوجد نتائج مطابقة للبحث' : 'No matching results found'}
              </h3>
            </div>
          )}
        </motion.div>
      </div>

      {/* Decorative background element */}
      <div className="fixed top-1/4 right-0 -z-10 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 left-0 -z-10 w-[300px] h-[300px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />
    </div>
  );
}
