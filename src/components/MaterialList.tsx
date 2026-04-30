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
      <div className="text-center py-16 bg-surface/30 rounded-3xl border border-dashed border-border">
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
            whileHover={{ x: isAr ? -3 : 3 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => {
              const url = isVideo ? item.url : downloadUrl;
              if (url) window.open(url, "_blank", "noopener,noreferrer");
            }}
            className={cn(
              "w-full group flex items-center justify-between px-4 py-3 md:py-5 lg:py-6 rounded-2xl border transition-all duration-300 shadow-sm border-border isolation-isolate",
              isVideo 
                ? "bg-red-500/5 border-red-500/20 text-red-600 hover:bg-red-500 hover:text-white"
                : "bg-surface hover:border-accent/30 hover:bg-surface/80"
            )}
          >
            {/* Title and Metadata on the Start side */}
            <div className="flex flex-col items-start text-start min-w-0 flex-1 pr-3 rtl:pr-0 rtl:pl-3 pointer-events-none">
              <span className={cn(
                "text-sm md:text-lg lg:text-xl font-black leading-tight break-words",
                isVideo ? "text-red-600 group-hover:text-white" : "text-foreground"
              )}>
                {item.title}
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-tight">
                  {item.uploader}
                </span>
                {item.size && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                    <span className="text-[10px] md:text-xs font-bold text-muted-foreground">{item.size}</span>
                  </>
                )}
              </div>
            </div>

            {/* Icon on the End side - Scaled down */}
            <div className={cn(
              "shrink-0 w-8 h-8 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-xl flex items-center justify-center transition-all duration-300 pointer-events-none",
              isVideo 
                ? "bg-red-500/10 text-red-500 group-hover:bg-white/20 group-hover:text-white" 
                : "bg-surface/80 text-muted-foreground group-hover:text-accent border border-border/50 shadow-inner"
            )}>
              {isVideo ? (
                <PlayCircle className="w-4 h-4 md:w-6 md:h-6 lg:w-7 lg:h-7" />
              ) : (
                <Download className="w-4 h-4 md:w-6 md:h-6 lg:w-7 lg:h-7" />
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
