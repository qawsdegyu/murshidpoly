import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Megaphone, ArrowRight } from "lucide-react";
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

  const getOptimizedUrl = (url: string) => {
    if (!url) return url;
    // If it's an Unsplash image, optimize it
    if (url.includes("unsplash.com")) {
      // Remove existing width/format params if any and add our own
      const baseUrl = url.split('?')[0];
      return `${baseUrl}?auto=format,compress&q=75&w=800&fit=crop`;
    }
    return url;
  };

  const optimizedImageUrl = getOptimizedUrl(imageUrl);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="h-full group"
    >
      <Link
        to={`/announcement/${targetId}`}
        aria-label={title}
        className="relative flex flex-row h-full overflow-hidden rounded-2xl md:rounded-3xl bg-card/45 border border-white/10 dark:border-white/5 backdrop-blur-md hover:border-accent shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_0_40px_hsl(var(--accent)/0.15)] transition-all duration-500 min-h-[125px] md:min-h-[160px] will-change-transform font-['Cairo']"
      >
        {/* Featured Image */}
        <div className="relative w-20 sm:w-24 md:w-[280px] lg:w-[320px] h-20 sm:h-24 md:h-auto overflow-hidden shrink-0 rounded-xl md:rounded-none m-2.5 md:m-0 self-center md:self-stretch">
          {optimizedImageUrl ? (
            <img
              src={optimizedImageUrl}
              alt={title}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-surface to-background grid place-items-center">
              <Megaphone className="h-8 w-8 md:h-12 md:w-12 text-accent/10" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-card via-card/40 to-transparent hidden md:block" />

          {/* Badge (Desktop) */}
          <div className="absolute top-4 ltr:left-4 rtl:right-4 hidden md:block">
            <div className="px-3 py-1 rounded-full bg-accent/10 backdrop-blur-md border border-accent/30 text-accent text-[10px] font-black uppercase tracking-widest shadow-2xl">
              {badge}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-5 md:p-8 flex flex-col justify-center items-start text-right rtl:text-right ltr:text-left relative z-10">
          <div className="w-full">
            {/* Mobile Badge */}
            {badge && (
              <div className="md:hidden mb-1 flex">
                <span className="px-2 py-0.5 rounded-md bg-accent/10 border border-accent/20 text-accent text-[9px] font-black uppercase tracking-wide">
                  {badge}
                </span>
              </div>
            )}
            
            <h3 className="text-sm md:text-2xl lg:text-3xl font-bold md:font-black text-[#F5F7FB] mb-1.5 md:mb-3 leading-normal font-['Cairo'] group-hover:text-[#7B3AED] transition-colors drop-shadow-sm line-clamp-none">
              {title}
            </h3>
            <p className="text-xs md:text-base text-gray-400 line-clamp-none leading-[1.7] font-normal font-['Cairo'] opacity-90 group-hover:opacity-100 transition-opacity">
              {desc}
            </p>
          </div>

          <div className="mt-2.5 md:mt-6 flex items-center gap-1.5 text-[11px] md:text-xs font-semibold text-[#7B3AED] group-hover:gap-2.5 transition-all uppercase tracking-wider font-['Cairo']">
            <span className="relative">
              {ctaLabel}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#7B3AED] transition-all group-hover:w-full" />
            </span>
            <ArrowRight className={`h-3 w-3 md:h-3.5 md:w-3.5 transition-transform group-hover:translate-x-1 ${dir === "rtl" ? "rotate-180 group-hover:-translate-x-1" : ""}`} />
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
