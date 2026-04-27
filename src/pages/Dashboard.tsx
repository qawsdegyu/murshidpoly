import { Link } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import { Calculator, Users, BookOpen, GraduationCap, ShoppingBag, ArrowRight, MapPin, ExternalLink, FileText } from "lucide-react";
import { usePreferences } from "@/contexts/PreferencesContext";
import AnnouncementCard from "@/components/AnnouncementCard";
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
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 220, damping: 24 } },
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
      to: "/gpa", 
      icon: Calculator, 
      label: t.nav.gpa, 
      desc: lang === "ar" ? "احسب معدلك الفصلي والتراكمي بدقة" : "Calculate semester & cumulative GPA", 
      featured: true, 
      image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1600",
      iconImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=400",
      effect: "swirl"
    },
    { 
      to: "/vault", 
      icon: BookOpen, 
      label: t.nav.vault, 
      desc: lang === "ar" ? "ملخصات، كتب، سنوات سابقة" : "Summaries, books, exams, quizzes", 
      image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=1600" 
    },
    { 
      to: "/majors", 
      icon: GraduationCap, 
      label: lang === "ar" ? "استكشف تخصصات الهندسة التكنولوجية" : "Explore Engineering Majors", 
      desc: lang === "ar" ? "دليل شامل لتخصصات كلية الهندسة التكنولوجية ومجالاتها" : "Comprehensive guide to engineering departments and fields", 
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1600",
      iconImage: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=400"
    },

    { 
      to: "/marketplace", 
      icon: ShoppingBag, 
      label: t.nav.marketplace, 
      desc: lang === "ar" ? "بيع وشراء الأدوات الهندسية" : "Buy & sell engineering tools", 
      image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1600" 
    },
    { 
      to: "/faculty", 
      icon: Users, 
      label: t.nav.faculty, 
      desc: lang === "ar" ? "ابحث عن المدرسين ومعلومات التواصل" : "Find professors & contact info", 
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1600",
      patternOverlay: true
    },
  ];

  return (
    <motion.div className="space-y-6 md:space-y-10" variants={container} initial="hidden" animate="show">
      {/* Hero */}
      <motion.section
        variants={item}
        className="relative overflow-hidden rounded-3xl md:rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-xl min-h-[320px] md:min-h-[420px] flex items-center transition-colors duration-300"
      >
        {/* Background Image with Overlays */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=1600" 
            alt="Engineering Tech" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-80" />
          <div className="absolute inset-0 bg-primary/30 mix-blend-overlay" />
        </div>

        <div className="relative z-10 p-5 md:p-14 w-full">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-16 w-16 p-2 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden group hover:scale-110 transition-transform duration-500">
              <img 
                src="/logo.png" 
                alt="Murshid Logo" 
                className="w-full h-full object-contain filter drop-shadow-lg"
              />
            </div>
            <div className="h-10 w-[1px] bg-white/20 mx-1" />
            <div className="flex flex-col">
              <div className="text-white font-black text-xl md:text-2xl tracking-tighter leading-none">{t.appName}</div>
              <div className="text-accent text-[10px] font-bold tracking-[0.2em] uppercase mt-1">Engineering Hub</div>
            </div>
          </div>

          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 backdrop-blur-md border border-accent/30 text-accent text-[11px] font-black tracking-wider uppercase mb-6 shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Faculty of Engineering Technology
            </div>
            <h1 className="text-2xl md:text-5xl lg:text-7xl font-black text-white mb-4 md:mb-6 leading-[1.05] drop-shadow-2xl">
              {t.dashboard.welcome}, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-yellow-400">
                Engineer
              </span>
            </h1>
            <p className="text-neutral-300 text-xs md:text-lg lg:text-xl max-w-xl leading-relaxed font-medium drop-shadow-lg">
              {t.dashboard.subtitle}
            </p>
          </div>
        </div>

        {/* Decorative Element */}
        <div className="absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-accent/20 blur-[120px] pointer-events-none" />
      </motion.section>

      {/* Public Resource Stats */}
      <motion.section variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats?.map((s) => (
          <motion.div
            key={s.label}
            variants={item}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to={s.to}
              className="group bg-surface/80 border border-border shadow-sm backdrop-blur-xl p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] flex flex-col h-full transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className="h-9 w-9 md:h-10 md:w-10 rounded-xl bg-accent/10 border border-accent/20 grid place-items-center group-hover:bg-accent/20 transition-colors">
                  <s.icon className="h-4 w-4 md:h-5 md:w-5 text-accent" />
                </div>
                <ArrowRight className="h-4 w-4 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="text-xl md:text-3xl font-black text-content tracking-tighter mb-1">{s.value}</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-content/50">{s.label}</div>
            </Link>
          </motion.div>
        ))}
      </motion.section>

      {/* Announcement / Ad banner */}
      <motion.div variants={item}>
        <AnnouncementCard />
      </motion.div>

      {/* Quick Actions — Bento with featured GPA spanning */}
      <motion.section variants={item}>
        <div className="flex items-center gap-4 mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-black tracking-tight text-foreground">{t.dashboard.quickActions}</h2>
          <div className="h-[2px] flex-1 bg-gradient-to-r from-accent/50 via-accent/5 to-transparent rounded-full" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr md:auto-rows-[220px] gap-3 md:gap-5">
          {quickActions?.map((a, i) => (
            <motion.div
              key={a.to}
              variants={item}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={a.featured ? "md:col-span-2 lg:row-span-2 lg:h-full" : ""}
            >
              <Link
                to={a.to}
                className={cn(
                  "group relative block h-full rounded-2xl md:rounded-[2.5rem] overflow-hidden bg-card/80 border border-border shadow-sm backdrop-blur-xl transition-all duration-500",
                  "aspect-square md:aspect-auto"
                )}
              >
                <div className="absolute inset-0 z-0">
                  <img 
                    src={a.image} 
                    alt={a.label} 
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 grayscale-[0.2] group-hover:grayscale-0 ${(a as any).effect === 'swirl' ? 'scale-125 rotate-12 blur-sm' : ''}`} 
                  />
                  <div className={`absolute inset-0 transition-all duration-500 ${(a as any).effect === 'swirl' ? 'bg-primary/40 backdrop-blur-md' : 'bg-black/60 group-hover:bg-black/40'}`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  
                  {/* Swirling Gold Highlight for GPA */}
                  {(a as any).effect === 'swirl' && (
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--accent)/0.3)_0%,transparent_70%)] animate-pulse" />
                  )}

                  {/* Overlay image for Majors */}
                  {(a as any).overlayImage && (
                    <div className="absolute inset-y-0 right-0 w-1/2 overflow-hidden pointer-events-none">
                      <img 
                        src={(a as any).overlayImage} 
                        alt="" 
                        className="h-full w-full object-contain object-right opacity-80 mix-blend-screen scale-110 group-hover:scale-125 transition-transform duration-700 drop-shadow-[0_0_15px_rgba(var(--accent-rgb),0.3)]" 
                      />
                    </div>
                  )}

                  {/* Pattern overlay for Faculty */}
                  {(a as any).patternOverlay && (
                    <div className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none" 
                         style={{ backgroundImage: `url(${a.image})`, backgroundSize: '400px' }} />
                  )}
                </div>

                <div className="relative z-10 h-full p-3 md:p-8 flex flex-col items-center justify-center text-center md:items-start md:text-start md:justify-between">
                  <div className="flex items-start justify-between">
                    <div className={cn(
                      "rounded-xl md:rounded-2xl overflow-hidden grid place-items-center bg-black/5 dark:bg-white/10 backdrop-blur-xl border border-black/10 dark:border-white/20 shadow-2xl group-hover:bg-accent group-hover:border-accent group-hover:shadow-[0_0_20px_rgba(var(--accent-rgb),0.4)] transition-all duration-500",
                      a.featured ? "h-12 w-12 md:h-16 md:w-16 mb-2 md:mb-0" : "h-10 w-10 md:h-12 md:w-12 mb-2 md:mb-0"
                    )}>
                      {(a as any).iconImage ? (
                        <img src={(a as any).iconImage} alt="" className="w-full h-full object-contain p-1" />
                      ) : (
                        <a.icon className={cn(
                          "transition-colors duration-500",
                          a.featured ? "h-6 w-6 md:h-8 md:w-8" : "h-5 w-5 md:h-6 md:w-6",
                          a.featured ? "text-accent group-hover:text-neutral-950" : "text-foreground group-hover:text-neutral-950"
                        )} />
                      )}
                    </div>
                    {a.featured && (
                      <div className="hidden md:flex px-4 py-2 rounded-xl bg-accent/20 backdrop-blur-md border border-accent/30 text-accent text-[10px] font-black uppercase tracking-widest items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                        Active Widget
                      </div>
                    )}
                    <div className="hidden md:grid h-10 w-10 rounded-full bg-white/5 border border-white/10 place-items-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                      <ArrowRight className="h-5 w-5 text-white ltr:rotate-0 rtl:rotate-180" />
                    </div>
                  </div>
                  
                  <div className={a.featured ? "mt-auto" : ""}>
                    {a.featured && (
                      <div className="mb-6 grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-surface/10 border border-white/20 backdrop-blur-2xl shadow-xl">
                          <div className="text-[10px] text-white/60 uppercase font-black tracking-widest mb-1">Target GPA</div>
                          <div className="text-3xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">4.00</div>
                        </div>
                        <div className="p-4 rounded-2xl bg-surface/10 border border-white/20 backdrop-blur-2xl shadow-xl">
                          <div className="text-[10px] text-white/60 uppercase font-black tracking-widest mb-1">Status</div>
                          <div className="text-sm font-black text-accent uppercase drop-shadow-[0_0_10px_rgba(var(--accent-rgb),0.5)]">On Track</div>
                        </div>
                      </div>
                    )}
                    <div className={cn(
                      "font-black text-white transition-colors duration-300 group-hover:text-accent",
                      a.featured ? "text-sm md:text-3xl lg:text-4xl mb-1 md:mb-3" : "text-sm md:text-xl mb-1"
                    )}>
                      {a.label}
                    </div>
                    <div className={cn(
                      "hidden md:block text-white/80 leading-relaxed font-medium transition-colors duration-300 group-hover:text-white",
                      a.featured ? "text-sm md:text-lg max-w-sm" : "text-[10px] md:text-xs"
                    )}>
                      {a.desc}
                    </div>
                  </div>
                </div>

                {/* Glass shine effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-tr from-transparent via-white/5 to-transparent transition-opacity duration-1000 pointer-events-none" />
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Campus Guide */}
      <motion.section variants={item}>
        <div className="flex items-end justify-between mb-5">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">{t.dashboard.campusGuide || "Campus Guide"}</h2>
          <div className="h-px flex-1 mx-4 md:mx-6 bg-gradient-to-r from-accent/40 to-transparent" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
          {buildings?.map((b) => (
            <motion.a
              key={b.id}
              href={b.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group bg-card/80 border border-border shadow-sm backdrop-blur-xl overflow-hidden rounded-2xl md:rounded-[2rem] flex flex-col transition-all duration-300"
            >
              <div className="h-40 w-full relative overflow-hidden">
                <img src={b.imageUrl} alt={b.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent" />
                <div className="absolute top-3 ltr:right-3 rtl:left-3 h-8 w-8 rounded-full bg-black/30 backdrop-blur-md grid place-items-center text-white border border-white/10">
                  <ExternalLink className="h-4 w-4" />
                </div>
              </div>
              <div className="p-4 md:p-5 flex-1 flex flex-col relative z-10 -mt-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-accent/20 border border-accent/30 grid place-items-center text-accent backdrop-blur-md shrink-0">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <h3 className="font-bold text-lg leading-tight text-foreground">{lang === "ar" ? b.nameAr : b.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground flex-1">{lang === "ar" ? b.descriptionAr : b.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(lang === "ar" ? b?.departmentsAr : b?.departments)?.map((dept) => (
                    <span key={dept} className="px-2.5 py-1 text-[10px] font-semibold tracking-wider rounded-md bg-accent/10 text-accent border border-accent/20">
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
