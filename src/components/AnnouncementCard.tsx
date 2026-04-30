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
        className="group relative flex flex-col md:flex-row h-full overflow-hidden rounded-3xl bg-[#0a192f]/70 border border-cyan-500/20 backdrop-blur-2xl hover:border-cyan-400/50 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_0_40px_rgba(0,255,255,0.15)] transition-all duration-500 min-h-[160px]"
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
            <div className="w-full h-full bg-gradient-to-br from-slate-950 to-slate-900 grid place-items-center">
              <Megaphone className="h-12 w-12 text-cyan-500/10" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0a192f] via-[#0a192f]/40 to-transparent" />
          
          {/* Badge */}
          <div className="absolute top-4 ltr:left-4 rtl:right-4">
            <div className="px-3 py-1 rounded-full bg-cyan-500/10 backdrop-blur-md border border-cyan-500/30 text-cyan-400 text-[10px] font-black uppercase tracking-widest shadow-2xl">
              {badge}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-center items-start text-right rtl:text-right ltr:text-left relative z-10">
          <div className="w-full">
            <h3 className="text-xl md:text-2xl lg:text-3xl font-black text-white mb-3 leading-tight font-['Cairo'] group-hover:text-cyan-300 transition-colors drop-shadow-sm">
              {title}
            </h3>
            <p className="text-sm md:text-base text-slate-300 line-clamp-2 leading-relaxed font-bold font-['Cairo'] opacity-70 group-hover:opacity-100 transition-opacity">
              {desc}
            </p>
          </div>

          <div className="mt-6 flex items-center gap-2 text-xs font-black text-cyan-400 group-hover:gap-4 transition-all uppercase tracking-widest font-['Cairo']">
            <span className="relative">
              {ctaLabel}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-cyan-400 transition-all group-hover:w-full" />
            </span>
            <ArrowRight className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${dir === "rtl" ? "rotate-180 group-hover:-translate-x-1" : ""}`} />
          </div>
        </div>

        {/* Decorative Internal Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[80px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      </Link>
    </motion.div>
  );
});

AnnouncementCard.displayName = "AnnouncementCard";

export default AnnouncementCard;
