import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Megaphone, Sparkles, ArrowRight, ImageIcon } from "lucide-react";
import { usePreferences } from "@/contexts/PreferencesContext";
import { announcements, type Announcement } from "@/data/announcements";

export interface AnnouncementCardProps {
  /** Optional id — defaults to the first announcement. */
  id?: string;
}

/**
 * AnnouncementCard — clickable promo banner that routes to /announcement/:id.
 * Glassmorphic dark container with BAU green→gold gradient accent.
 */
export default function AnnouncementCard({ id }: AnnouncementCardProps) {
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
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <Link
        to={`/announcement/${ann.id}`}
        aria-label={title}
        className="group relative block overflow-hidden rounded-2xl bg-white/80 border border-slate-200 shadow-sm backdrop-blur-xl dark:bg-white/[0.03] dark:border-white/[0.08] dark:backdrop-blur-2xl hover:scale-[1.01] hover:border-accent/60 transition-all duration-300"
      >
        {/* Gradient wash: BAU green → gold */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/10 to-accent/25 pointer-events-none" />
        <div className="absolute -top-24 ltr:-right-24 rtl:-left-24 h-64 w-64 rounded-full bg-accent/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 ltr:-left-24 rtl:-right-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl pointer-events-none" />

        <div className="relative grid md:grid-cols-[1fr_auto] gap-6 p-6 md:p-8 items-center">
          {/* Content */}
          <div className="min-w-0">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-accent/15 text-accent border border-accent/30 backdrop-blur-sm mb-3">
              <Megaphone className="h-3.5 w-3.5" />
              {badge}
            </div>
            <h3 className="text-xl md:text-2xl font-extrabold text-gold mb-2 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent shrink-0" />
              <span>{title}</span>
            </h3>
            <p className="text-sm md:text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
              {desc}
            </p>
            <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-accent group-hover:gap-3 transition-all">
              {ctaLabel}
              <ArrowRight className={`h-4 w-4 ${dir === "rtl" ? "rotate-180" : ""}`} />
            </div>
          </div>

          {/* Promo image / placeholder */}
          <div className="hidden md:block w-48 lg:w-56 aspect-[4/3] rounded-xl overflow-hidden border border-accent/30 bg-background/30 backdrop-blur-md shrink-0">
            {ann.imageUrl ? (
              <img src={ann.imageUrl} alt={title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full grid place-items-center text-center px-3">
                <div>
                  <div className="mx-auto h-10 w-10 rounded-lg bg-accent/15 grid place-items-center border border-accent/30 mb-2">
                    <ImageIcon className="h-5 w-5 text-accent" />
                  </div>
                  <div className="text-[11px] text-muted-foreground font-medium">
                    {lang === "ar" ? "أضف صورة الإعلان" : "Promo image"}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
