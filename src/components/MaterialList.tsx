import { motion } from "framer-motion";
import { Download, FileText, BookMarked, FileCheck, PlayCircle, Eye, ExternalLink } from "lucide-react";
import { type Resource } from "@/data/mockData";
import { usePreferences } from "@/contexts/PreferencesContext";
import { cn } from "@/lib/utils";

interface MaterialListProps {
  items: Resource[];
  emptyMessage?: string;
}

const typeIcons: Record<string, any> = {
  summary: FileText,
  book: BookMarked,
  exam: FileCheck,
  video: PlayCircle,
};

const getDownloadLink = (r: Resource) => {
  if (!r.url) return null;
  const idMatch = r.url.match(/id=([a-zA-Z0-9_-]+)/) || r.url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (idMatch && idMatch[1]) {
    return `https://drive.google.com/uc?export=download&id=${idMatch[1]}`;
  }
  return r.url;
};

export default function MaterialList({ items, emptyMessage }: MaterialListProps) {
  const { t, lang, dir } = usePreferences();
  const isAr = lang === "ar";

  if (items.length === 0) {
    return (
      <div className="text-center py-16 bg-surface/30 dark:bg-surface/5 rounded-3xl border border-dashed border-border dark:border-white/10">
        <p className="text-muted-foreground text-sm font-bold">
          {emptyMessage || (isAr ? "لا توجد ملفات متاحة حالياً ✨" : "No files available yet ✨")}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      {items.map((item, i) => {
        const isVideo = item.type === "video";
        const downloadUrl = getDownloadLink(item);

        return (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            whileHover={{ scale: 1.005, x: isAr ? -3 : 3 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => {
              const url = isVideo ? item.url : downloadUrl;
              if (url) window.open(url, "_blank", "noopener,noreferrer");
            }}
            className={cn(
              "w-full group flex items-center justify-between px-3 py-2 md:py-2.5 rounded-xl border transition-all duration-300 shadow-sm",
              isVideo 
                ? "bg-red-500/5 border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white"
                : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-primary/30 hover:bg-slate-50 dark:hover:bg-white/10"
            )}
          >
            {/* Title and Metadata on the Start side */}
            <div className="flex flex-col items-start text-start min-w-0 flex-1 pr-3 rtl:pr-0 rtl:pl-3">
              <span className={cn(
                "text-xs md:text-[13px] font-black leading-tight break-words",
                isVideo ? "text-red-600 dark:text-red-400 group-hover:text-white" : "text-slate-900 dark:text-slate-100"
              )}>
                {item.title}
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">
                  {item.uploader}
                </span>
                {item.size && (
                  <>
                    <span className="w-0.5 h-0.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                    <span className="text-[10px] font-bold text-slate-400">{item.size}</span>
                  </>
                )}
              </div>
            </div>

            {/* Icon on the End side - Scaled down */}
            <div className={cn(
              "shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300",
              isVideo 
                ? "bg-red-500/10 text-red-500 group-hover:bg-white/20 group-hover:text-white" 
                : "bg-slate-100 dark:bg-white/10 text-slate-400 group-hover:text-primary dark:group-hover:text-accent"
            )}>
              {isVideo ? (
                <PlayCircle className="w-3.5 h-3.5" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
