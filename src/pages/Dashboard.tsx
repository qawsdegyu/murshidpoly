import { Link } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import { Calculator, Users, BookOpen, GraduationCap, ShoppingBag, ArrowRight, MapPin, ExternalLink, FileText, BookOpenText, BrainCircuit } from "lucide-react";
import { usePreferences } from "@/contexts/PreferencesContext";
import AnnouncementCard from "@/components/AnnouncementCard";
import QuickLinkCard from "@/components/QuickLinkCard";
import BauQuickLinks from "@/components/BauQuickLinks";
import { buildings } from "@/data/mockData";
import { cn } from "@/lib/utils";

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};
const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

export default function Dashboard() {
  const { t, lang } = usePreferences();

  const stats = [
    { label: lang === "ar" ? "ملفات الدراسة" : "Study Files", value: "240+", icon: FileText, to: "/vault" },
    { label: lang === "ar" ? "التخصصات" : "Majors", value: "10", icon: GraduationCap, to: "/majors" },
    { label: lang === "ar" ? "حاسبة المعدل" : "GPA Calc", value: lang === "ar" ? "ذكية" : "Smart", icon: Calculator, to: "/gpa" },
    { label: lang === "ar" ? "خريطة الحرم" : "Campus Map", value: lang === "ar" ? "تفاعلية" : "Interactive", icon: MapPin, to: "/campus-map" },
  ];

  const quickActions = [
    { 
      to: "/vault", 
      icon: BookOpenText, 
      label: lang === "ar" ? "خزانة المواد" : "Subject Vault", 
      desc: lang === "ar" ? "ملخصات، كتب، سنوات سابقة" : "Summaries, books, exams, quizzes"
    },
    { 
      to: "/gpa", 
      icon: Calculator, 
      label: lang === "ar" ? "حاسبة المعدل" : "GPA Calculator", 
      desc: lang === "ar" ? "احسب معدلك الفصلي والتراكمي بدقة" : "Calculate semester & cumulative GPA"
    },
    { 
      to: "/marketplace", 
      icon: ShoppingBag, 
      label: lang === "ar" ? "السوق" : "Marketplace", 
      desc: lang === "ar" ? "بيع وشراء الأدوات الهندسية" : "Buy & sell engineering tools"
    },
    { 
      to: "/roadmap", 
      icon: BrainCircuit, 
      label: lang === "ar" ? "الخطة الدراسية" : "Study Plan", 
      desc: lang === "ar" ? "تتبع مسارك الأكاديمي" : "Track your academic journey"
    },
  ];

  return (
    <motion.div className="space-y-4 md:space-y-6" variants={container} initial="hidden" animate="show">
      {/* Hero */}
      <motion.section
        variants={item}
        className="relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-xl min-h-[260px] md:min-h-[340px] flex items-center transition-colors duration-300"
      >
        {/* Background Image with Overlays */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=1600" 
            alt="Engineering Tech" 
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-80" />
          <div className="absolute inset-0 bg-primary/30 mix-blend-overlay" />
        </div>

        <div className="relative z-10 p-4 md:p-10 w-full">
          <div className="flex items-center gap-3 mb-6">
            <img 
              src="/rs.png" 
              alt="Murshid Logo" 
              className="h-12 w-12 rounded-full object-contain shadow-md border border-white/20 hover:scale-110 transition-transform duration-500"
              loading="lazy"
              decoding="async"
            />
            <div className="h-8 w-[1px] bg-white/20 mx-0.5" />
            <div className="flex flex-col">
              <div className="text-white font-black text-lg md:text-xl tracking-tighter leading-none">{t.appName}</div>
              <div className="text-accent text-[9px] font-bold tracking-[0.2em] uppercase mt-0.5">Engineering Hub</div>
            </div>
          </div>

          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-accent/20 backdrop-blur-md border border-accent/30 text-accent text-[10px] font-black tracking-wider uppercase mb-4 shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Faculty of Engineering Technology
            </div>
            <h1 className="text-2xl md:text-4xl lg:text-6xl font-black text-white mb-3 md:mb-4 leading-[1.05] drop-shadow-2xl">
              {t.dashboard.welcome}, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-yellow-400">
                Engineer
              </span>
            </h1>
            <p className="text-neutral-300 text-[11px] md:text-base lg:text-lg max-w-xl leading-relaxed font-bold drop-shadow-lg">
              {t.dashboard.subtitle}
            </p>
          </div>
        </div>

        {/* Decorative Element */}
        <div className="absolute -right-20 -bottom-20 h-80 w-80 rounded-full bg-accent/20 blur-[100px] pointer-events-none hidden md:block" />
      </motion.section>

      {/* Public Resource Stats */}
      <motion.section variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats?.map((s) => (
          <motion.div
            key={s.label}
            variants={item}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to={s.to}
              className="group bg-surface/80 border border-border shadow-sm backdrop-blur-xl p-2.5 md:p-4 rounded-xl md:rounded-[1.5rem] flex flex-col h-full transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-1.5 md:mb-2">
                <div className="h-7 w-7 md:h-8 md:w-8 rounded-lg bg-accent/10 border border-accent/20 grid place-items-center group-hover:bg-accent/20 transition-colors">
                  <s.icon className="h-3.5 w-3.5 md:h-4 md:w-4 text-accent" />
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="text-xl md:text-3xl font-black text-content tracking-tighter mb-0.5">{s.value}</div>
              <div className="text-[9px] font-black uppercase tracking-widest text-content/50">{s.label}</div>
            </Link>
          </motion.div>
        ))}
      </motion.section>

      {/* Announcement / Ad banner */}
      <motion.div variants={item}>
        <AnnouncementCard />
      </motion.div>

      <motion.section variants={item} className="relative z-10">
        <div className="flex items-center gap-4 mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-black tracking-tight text-foreground">{t.dashboard.quickActions}</h2>
          <div className="h-[2px] flex-1 bg-gradient-to-r from-accent/50 via-accent/5 to-transparent rounded-full" />
        </div>
        
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:flex lg:justify-center lg:gap-10">
            {quickActions?.map((a) => (
              <QuickLinkCard
                key={a.to}
                to={a.to}
                icon={a.icon}
                label={a.label}
              />
            ))}
        </div>
      </motion.section>

      {/* Campus Guide */}
      <motion.section variants={item}>
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-foreground">{t.dashboard.campusGuide || "Campus Guide"}</h2>
          <div className="h-px flex-1 mx-4 md:mx-6 bg-gradient-to-r from-accent/40 to-transparent" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {buildings?.map((b) => (
            <motion.a
              key={b.id}
              href={b.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group bg-card/80 border border-border shadow-sm backdrop-blur-xl overflow-hidden rounded-2xl md:rounded-[2.5rem] flex flex-col transition-all duration-300"
            >
              <div className="h-24 md:h-28 w-full relative overflow-hidden">
                <img 
                  src={b.imageUrl} 
                  alt={b.name} 
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="absolute top-2 ltr:right-2 rtl:left-2 h-7 w-7 rounded-full bg-black/40 backdrop-blur-md grid place-items-center text-white border border-white/20 shadow-lg">
                  <ExternalLink className="h-3 w-3" />
                </div>
              </div>
              <div className="p-3 md:p-4 flex-1 flex flex-col bg-card/50 dark:bg-card/20 backdrop-blur-xl">
                <div className="flex items-start gap-2 mb-1.5">
                  <div className="h-7 w-7 rounded-lg bg-accent/20 border border-accent/30 grid place-items-center text-accent shrink-0">
                    <MapPin className="h-3.5 w-3.5" />
                  </div>
                  <h3 className="font-black text-base md:text-lg leading-tight text-foreground break-words">
                    {lang === "ar" ? b.nameAr : b.name}
                  </h3>
                </div>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed flex-1 mb-3 font-bold">
                  {lang === "ar" ? b.descriptionAr : b.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {(lang === "ar" ? b?.departmentsAr : b?.departments)?.map((dept) => (
                    <span key={dept} className="px-2.5 py-1 text-[9px] font-black uppercase tracking-wider rounded-lg bg-accent/10 text-accent border border-accent/20">
                      {dept}
                    </span>
                  ))}
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </motion.section>

      {/* BAU Official Quick Links */}
      <motion.div variants={item}>
        <BauQuickLinks />
      </motion.div>
    </motion.div>
  );
}
