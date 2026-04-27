import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Megaphone, ImagePlus, Sparkles, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { announcements } from "@/data/announcements";
import { usePreferences } from "@/contexts/PreferencesContext";

export default function AnnouncementDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { lang, dir } = usePreferences();

  const ann = announcements.find(a => a.id === id);

  if (!ann) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground mb-4">
          {lang === "ar" ? "الإعلان غير موجود." : "Announcement not found."}
        </p>
        <Button onClick={() => nav("/")}>
          {lang === "ar" ? "الرئيسية" : "Dashboard"}
        </Button>
      </div>
    );
  }

  const title = lang === "ar" ? ann.titleAr : ann.title;
  const full = lang === "ar" ? ann.fullDescriptionAr : ann.fullDescription;
  const badge = lang === "ar" ? ann.badgeAr : ann.badge;
  const ctaLabel = lang === "ar" ? ann.ctaLabelAr : ann.ctaLabel;
  const backLabel = lang === "ar" ? "العودة إلى الرئيسية" : "Back to Dashboard";

  return (
    <motion.div
      dir={dir}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="font-cairo min-h-screen bg-background"
    >
      {/* Back */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent mb-6 transition-colors"
      >
        <ArrowLeft className={`h-4 w-4 ${dir === "rtl" ? "rotate-180" : ""}`} />
        {backLabel}
      </Link>

      {/* HERO IMAGE */}
      <motion.section
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative w-full h-56 sm:h-72 md:h-96 rounded-2xl overflow-hidden shadow-elegant mb-8 border border-accent/30"
      >
        {ann.imageUrl ? (
          <img src={ann.imageUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <PlaceholderHero />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent pointer-events-none" />

        {/* Badge floating on hero */}
        <div className="absolute top-4 ltr:left-4 rtl:right-4 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-background/70 backdrop-blur-md text-accent border border-accent/40">
          <Megaphone className="h-3.5 w-3.5" />
          {badge}
        </div>
      </motion.section>

      {/* TITLE */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gold tracking-tight mb-6 flex items-center gap-3"
      >
        <Sparkles className="h-7 w-7 text-accent shrink-0" />
        {title}
      </motion.h1>

      {/* DESCRIPTION */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18, duration: 0.4 }}
        className="glass rounded-2xl p-6 md:p-8 mb-8 border border-border"
      >
        <p
          className="text-base md:text-[17px] leading-[1.95] text-foreground/90 dark:text-foreground tracking-normal whitespace-pre-line"
          style={{ fontFamily: "'Cairo', 'Tajawal', 'Inter', system-ui, sans-serif" }}
        >
          {full}
        </p>
      </motion.section>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28, duration: 0.4 }}
        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
      >
        <Button
          asChild
          size="lg"
          className="gradient-gold text-primary font-extrabold text-base h-12 px-8 hover:opacity-90 shadow-gold"
        >
          <a href={ann.ctaLink} target="_blank" rel="noopener noreferrer">
            {ctaLabel}
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
        <Button
          asChild
          variant="outline"
          size="lg"
          className="h-12 border-accent/40 hover:border-accent hover:text-accent"
        >
          <Link to="/">
            <ArrowRight className={`h-4 w-4 ${dir === "rtl" ? "" : "rotate-180"}`} />
            {backLabel}
          </Link>
        </Button>
      </motion.div>
    </motion.div>
  );
}

/* ---------- Placeholder hero (engineering blueprint) ---------- */
function PlaceholderHero() {
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-primary via-primary/80 to-accent/70">
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.35) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.35) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "8px 8px",
        }}
      />
      <svg className="absolute -top-10 -right-10 w-72 h-72 opacity-15 text-white" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
        <circle cx="50" cy="50" r="40" />
        <circle cx="50" cy="50" r="30" />
        <circle cx="50" cy="50" r="20" />
        <line x1="10" y1="50" x2="90" y2="50" />
        <line x1="50" y1="10" x2="50" y2="90" />
      </svg>
      <div className="relative z-10 h-full w-full grid place-items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="text-center px-6"
        >
          <div className="mx-auto h-16 w-16 rounded-2xl bg-white/15 backdrop-blur-md grid place-items-center border border-white/30 shadow-elegant mb-3">
            <ImagePlus className="h-8 w-8 text-white" strokeWidth={1.5} />
          </div>
          <div className="text-white font-bold text-lg drop-shadow">Hero Image Placeholder</div>
          <div className="text-white/80 text-xs mt-1 drop-shadow">
            Set imageUrl in src/data/announcements.ts
          </div>
        </motion.div>
      </div>
    </div>
  );
}
