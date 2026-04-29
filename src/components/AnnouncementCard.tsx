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
        
        <div className="relative grid md:grid-cols-[1fr_auto] gap-8 p-8 md:p-12 items-center">
          {/* Content */}
          <div className="min-w-0">
            <div className="inline-flex items-center gap-1.5 text-[12px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full bg-accent/15 text-accent border border-accent/30 backdrop-blur-sm mb-6">
              <Megaphone className="h-4 w-4" />
              {badge}
            </div>
            <h3 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-slate-100 mb-4 flex items-start gap-3 leading-[1.1]">
              <Sparkles className="h-8 w-8 text-accent shrink-0 mt-1" />
              <span className="break-words">{title}</span>
            </h3>
            <p className="text-base md:text-xl text-muted-foreground leading-relaxed max-w-3xl mb-8 break-words">
              {desc}
            </p>
            <div className="inline-flex items-center gap-2 text-sm md:text-base font-black text-accent group-hover:gap-4 transition-all">
              {ctaLabel}
              <ArrowRight className={`h-5 w-5 ${dir === "rtl" ? "rotate-180" : ""}`} />
            </div>
          </div>

          {/* Optimized image */}
          <div className="hidden md:block w-48 lg:w-56 aspect-[4/3] rounded-xl overflow-hidden border border-accent/30 bg-background/30 backdrop-blur-md shrink-0">
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
                <Megaphone className="h-12 w-12 text-accent/20" />
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
