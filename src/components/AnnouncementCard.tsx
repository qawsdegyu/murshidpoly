import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Megaphone, Sparkles, ArrowRight } from "lucide-react";
import { usePreferences } from "@/contexts/PreferencesContext";
import { memo } from "react";
import { announcements } from "../data/mockData";
import type { Announcement } from "../data/mockData";

interface AnnouncementCardProps {
  id?: string;
}

const AnnouncementCard = memo(({ id }: AnnouncementCardProps) => {
  const { dir, lang } = usePreferences();

  const ann: Announcement | undefined =
    (id && announcements.find(a => a.id === id)) || announcements[0];
  if (!ann) return null;

  const title = lang === "ar" ? ann.titleAr : ann.title;
  const desc = lang === "ar" ? ann.shortDescriptionAr : ann.shortDescription;
  const badge = lang === "ar" ? ann.badgeAr : ann.badge;
  const ctaLabel = lang === "ar" ? "اعرف المزيد" : "Learn More";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={{ willChange: "transform, opacity" }}
    >
      <Link
        to={`/announcement/${ann.id}`}
        aria-label={title}
        className="group relative block overflow-hidden rounded-2xl bg-card/80 border border-border shadow-sm backdrop-blur-xl hover:scale-[1.01] hover:border-accent/60 transition-all duration-300"
      >
        {/* Optimized background wash */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-accent/15 pointer-events-none" />
        <div className="absolute -top-24 ltr:-right-24 rtl:-left-24 h-64 w-64 rounded-full bg-accent/15 blur-3xl pointer-events-none hidden md:block" />
        
        <div className="relative grid md:grid-cols-[1fr_auto] gap-5 p-4 md:p-6 items-center">
          {/* Content */}
          <div className="min-w-0">
            <div className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.2em] px-2.5 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/30 backdrop-blur-sm mb-3">
              <Megaphone className="h-3 w-3" />
              {badge}
            </div>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-slate-100 mb-2 flex items-start gap-1.5 leading-[1.1]">
              <Sparkles className="h-5 w-5 text-accent shrink-0 mt-0.5" />
              <span className="break-words">{title}</span>
            </h3>
            <p className="text-[11px] md:text-sm text-muted-foreground leading-snug max-w-2xl mb-4 break-words font-bold">
              {desc}
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs font-black text-accent group-hover:gap-3 transition-all">
              {ctaLabel}
              <ArrowRight className={`h-4 w-4 ${dir === "rtl" ? "rotate-180" : ""}`} />
            </div>
          </div>

          {/* Optimized image */}
          <div className="hidden md:block w-28 lg:w-36 aspect-[4/3] rounded-lg overflow-hidden border border-accent/30 bg-background/30 backdrop-blur-md shrink-0">
            {ann.imageUrl ? (
              <img 
                src={ann.imageUrl} 
                alt={title} 
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
            ) : (
              <div className="w-full h-full bg-accent/5 grid place-items-center">
                <Megaphone className="h-8 w-8 text-accent/20" />
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

AnnouncementCard.displayName = "AnnouncementCard";

export default AnnouncementCard;
