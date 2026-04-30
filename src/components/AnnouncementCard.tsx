import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Megaphone, Sparkles, ArrowRight } from "lucide-react";
import { usePreferences } from "@/contexts/PreferencesContext";
import { memo } from "react";
import { announcements } from "../data/mockData";
import type { Announcement } from "../data/mockData";

interface AnnouncementCardProps {
  id?: string;
  data?: any;
}

const AnnouncementCard = memo(({ id, data }: AnnouncementCardProps) => {
  const { dir, lang } = usePreferences();

  const ann = data || (id && announcements.find(a => a.id === id)) || announcements[0];
  if (!ann) return null;

  const title = lang === "ar" ? (ann.title_ar || ann.titleAr) : ann.title;
  const desc = lang === "ar" ? (ann.short_description_ar || ann.shortDescriptionAr) : (ann.short_description || ann.shortDescription);
  const badge = lang === "ar" ? (ann.badge_ar || ann.badgeAr) : ann.badge;
  const ctaLabel = lang === "ar" ? "اعرف المزيد" : "Learn More";
  const imageUrl = ann.image_url || ann.imageUrl;
  const targetId = ann.id;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="h-full"
    >
      <Link
        to={`/announcement/${targetId}`}
        aria-label={title}
        className="group relative flex flex-col md:flex-row h-full overflow-hidden rounded-3xl bg-card border border-border backdrop-blur-2xl hover:border-accent shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:shadow-[0_0_40px_hsl(var(--accent)/0.15)] transition-all duration-500 min-h-[160px]"
      >
        {/* Featured Image */}
        <div className="relative w-full md:w-[280px] lg:w-[320px] h-48 md:h-auto overflow-hidden shrink-0">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={title} 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-surface to-background grid place-items-center">
              <Megaphone className="h-12 w-12 text-accent/10" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-card via-card/40 to-transparent" />
          
          {/* Badge */}
          <div className="absolute top-4 ltr:left-4 rtl:right-4">
            <div className="px-3 py-1 rounded-full bg-accent/10 backdrop-blur-md border border-accent/30 text-accent text-[10px] font-black uppercase tracking-widest shadow-2xl">
              {badge}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-center items-start text-right rtl:text-right ltr:text-left relative z-10">
          <div className="w-full">
            <h3 className="text-xl md:text-2xl lg:text-3xl font-black text-card-foreground mb-3 leading-tight font-['Cairo'] group-hover:text-accent transition-colors drop-shadow-sm">
              {title}
            </h3>
            <p className="text-sm md:text-base text-content/60 line-clamp-2 leading-relaxed font-bold font-['Cairo'] opacity-70 group-hover:opacity-100 transition-opacity">
              {desc}
            </p>
          </div>

          <div className="mt-6 flex items-center gap-2 text-xs font-black text-accent group-hover:gap-4 transition-all uppercase tracking-widest font-['Cairo']">
            <span className="relative">
              {ctaLabel}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent transition-all group-hover:w-full" />
            </span>
            <ArrowRight className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${dir === "rtl" ? "rotate-180 group-hover:-translate-x-1" : ""}`} />
          </div>
        </div>

        {/* Decorative Internal Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-[80px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      </Link>
    </motion.div>
  );
});

AnnouncementCard.displayName = "AnnouncementCard";

export default AnnouncementCard;
