import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Download, FileText, BookMarked, FileCheck, PlayCircle, 
  ChevronLeft, ChevronRight, Hash
} from "lucide-react";
import { type Resource } from "@/data/mockData";
import { usePreferences } from "@/contexts/PreferencesContext";
import { cn } from "@/lib/utils";

interface MaterialListProps {
  items: Resource[];
  emptyMessage?: string;
  itemsPerPage?: number;
}

export default function MaterialList({ items, emptyMessage, itemsPerPage = 10 }: MaterialListProps) {
  const { t, lang, dir } = usePreferences();
  const isAr = lang === "ar";
  const [currentPage, setCurrentPage] = useState(1);

  // Helper to translate common Arabic terms to English if language is English
  const localizeString = (text: string | undefined, isEn: boolean) => {
    if (!text) return "";
    if (!isEn) return text;
    let res = text;
    res = res.replace(/الدكتور\s+/g, "Dr. ");
    res = res.replace(/د\.\s*/g, "Dr. ");
    res = res.replace(/شرح/g, "Explanation");
    res = res.replace(/ملخص/g, "Summary");
    res = res.replace(/أسئلة/g, "Questions");
    res = res.replace(/امتحان/g, "Exam");
    res = res.replace(/حلول/g, "Solutions");
    res = res.replace(/سنوات/g, "Past Papers");
    res = res.replace(/ميد/g, "Midterm");
    res = res.replace(/فاينل/g, "Final");
    return res;
  };

  // Reset to page 1 if items change (e.g., tab change)
  useMemo(() => {
    setCurrentPage(1);
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="text-center py-16 bg-surface/30 rounded-3xl border border-dashed border-border">
        <p className="text-muted-foreground text-sm font-bold">
          {emptyMessage || (isAr ? "لا توجد ملفات متاحة حالياً ✨" : "No files available yet ✨")}
        </p>
      </div>
    );
  }

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  const getDownloadLink = (r: Resource) => {
    if (!r.url) return null;
    const idMatch = r.url.match(/id=([a-zA-Z0-9_-]+)/) || r.url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (idMatch && idMatch[1]) {
      return `https://drive.google.com/uc?export=download&id=${idMatch[1]}`;
    }
    return r.url;
  };

  return (
    <div className="space-y-8 w-full">
      <div className="flex flex-col gap-3 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-3"
          >
            {currentItems.map((item, i) => {
              const isVideo = item.type === "video";
              const downloadUrl = getDownloadLink(item);

              return (
                <motion.button
                  key={item.id}
                  whileHover={{ x: isAr ? -5 : 5 }}
                  whileTap={{ scale: 0.995 }}
                  onClick={() => {
                    const url = isVideo ? item.url : downloadUrl;
                    if (url) window.open(url, "_blank", "noopener,noreferrer");
                  }}
                  className={cn(
                    "w-full group flex items-center justify-between px-5 py-4 rounded-2xl border transition-all duration-300 shadow-sm isolation-isolate",
                    isVideo 
                      ? "bg-red-500/5 border-red-500/20 text-red-600 hover:bg-red-500 hover:text-white"
                      : "bg-[#F8FAFC] dark:bg-[#1E293B] border-[#E2E8F0] dark:border-[#334155] hover:border-[#CBD5E1] dark:hover:border-[#64748B] hover:shadow-md"
                  )}
                >
                  <div className="flex flex-col items-start text-start min-w-0 flex-1 pr-4 rtl:pr-0 rtl:pl-4 pointer-events-none">
                    <span className={cn(
                      "text-sm md:text-lg lg:text-xl font-black leading-tight break-words",
                      isVideo ? "text-red-600 group-hover:text-white" : "text-[#0F172A] dark:text-[#F8FAFC]"
                    )}>
                      {localizeString(item.title, !isAr)}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] md:text-xs font-bold text-[#CBD5E1] dark:text-[#94A3B8] uppercase tracking-tight">
                        {localizeString(item.uploader, !isAr)}
                      </span>
                      {item.size && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-[#CBD5E1] dark:bg-[#94A3B8]" />
                          <span className="text-[10px] md:text-xs font-bold text-[#CBD5E1] dark:text-[#94A3B8]">{item.size}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className={cn(
                      "shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all duration-300 pointer-events-none",
                      isVideo 
                        ? "bg-red-500/10 text-red-500 group-hover:bg-white/20 group-hover:text-white" 
                        : "bg-[#F1F5F9] dark:bg-[#0F172A] text-[#64748B] dark:text-[#14B8A6] group-hover:bg-[#E2E8F0] dark:group-hover:bg-[#334155] group-hover:text-[#0F172A] dark:group-hover:text-[#5EEAD4]"
                    )}>
                      {isVideo ? (
                        <PlayCircle className="w-5 h-5 md:w-6 md:h-6" />
                      ) : (
                        <Download className="w-5 h-5 md:w-6 md:h-6" />
                      )}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center gap-6 pt-8 border-t border-border/50">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-3 rounded-xl bg-surface border border-border text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className={cn("w-5 h-5", isAr && "rotate-180")} />
            </button>

            <div className="flex items-center gap-1.5 px-3">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                const isActive = currentPage === page;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={cn(
                      "min-w-[40px] h-10 rounded-xl font-black text-sm transition-all",
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
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-3 rounded-xl bg-surface border border-border text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className={cn("w-5 h-5", isAr && "rotate-180")} />
            </button>
          </div>

          <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface/50 border border-border/50 backdrop-blur-md">
            <Hash className="w-3.5 h-3.5 text-accent opacity-50" />
            <span className="text-[10px] md:text-xs font-black text-muted-foreground uppercase tracking-widest">
              {isAr ? `عرض ${indexOfFirstItem + 1} - ${Math.min(indexOfLastItem, items.length)} من أصل ${items.length}` : `Showing ${indexOfFirstItem + 1} - ${Math.min(indexOfLastItem, items.length)} of ${items.length}`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
