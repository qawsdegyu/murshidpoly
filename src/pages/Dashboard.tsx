import { Link } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import { Calculator, Users, BookOpen, GraduationCap, ShoppingBag, ArrowRight, MapPin, ExternalLink, FileText } from "lucide-react";
import { usePreferences } from "@/contexts/PreferencesContext";
import AnnouncementCard from "@/components/AnnouncementCard";
import BauQuickLinks from "@/components/BauQuickLinks";
import { buildings } from "@/data/mockData";

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
      desc: "Calculate semester & cumulative GPA", 
      featured: true, 
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1600" // Futuristic data visualization
    },
    { 
      to: "/vault", 
      icon: BookOpen, 
      label: t.nav.vault, 
      desc: "Summaries, books, exams, quizzes", 
      image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=1600" // Modern library/vault
    },
    { 
      to: "/majors", 
      icon: GraduationCap, 
      label: lang === "ar" ? "استكشف تخصصات الهندسة التكنولوجية" : "Explore Engineering Majors", 
      desc: lang === "ar" ? "دليل شامل لتخصصات كلية الهندسة التكنولوجية ومجالاتها" : "Comprehensive guide to engineering departments and fields", 
      image: "https://images.unsplash.com/photo-1503387762-592dea58ef21?auto=format&fit=crop&q=80&w=1600" // Architectural drones view
    },

    { 
      to: "/marketplace", 
      icon: ShoppingBag, 
      label: t.nav.marketplace, 
      desc: "Buy & sell engineering tools", 
      image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1600" // Engineering components
    },
    { 
      to: "/faculty", 
      icon: Users, 
      label: t.nav.faculty, 
      desc: "Find professors & contact info", 
      image: "https://images.unsplash.com/photo-1523240715630-973655160e51?auto=format&fit=crop&q=80&w=1600" // Collaboration/Education
    },
  ];

  return (
    <motion.div className="space-y-10" variants={container} initial="hidden" animate="show">
      {/* Hero */}
      <motion.section
        variants={item}
        className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-xl min-h-[420px] flex items-center transition-colors duration-300"
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

        <div className="relative z-10 p-8 md:p-14 w-full">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-16 w-16 p-2 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden group hover:scale-110 transition-transform duration-500">
              <img 
                src="https://upload.wikimedia.org/wikipedia/en/2/2d/Al-Balqa_Applied_University_logo.png" 
                alt="BAU Logo" 
                className="w-full h-full object-contain filter drop-shadow-lg"
              />
            </div>
            <div className="h-10 w-[1px] bg-white/20 mx-1" />
            <div className="flex flex-col">
              <div className="text-white font-black text-2xl tracking-tighter leading-none">{t.appName}</div>
              <div className="text-accent text-[10px] font-bold tracking-[0.2em] uppercase mt-1">Engineering Hub</div>
            </div>
          </div>

          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 backdrop-blur-md border border-accent/30 text-accent text-[11px] font-black tracking-wider uppercase mb-6 shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Faculty of Engineering Technology
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-[1.05] drop-shadow-2xl">
              {t.dashboard.welcome}, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-yellow-400">
                Engineer
              </span>
            </h1>
            <p className="text-neutral-300 text-lg md:text-xl max-w-xl leading-relaxed font-medium drop-shadow-lg">
              {t.dashboard.subtitle}
            </p>
          </div>
        </div>

        {/* Decorative Element */}
        <div className="absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-accent/20 blur-[120px] pointer-events-none" />
      </motion.section>

      {/* Public Resource Stats */}
      <motion.section variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <motion.div
            key={s.label}
            variants={item}
            whileHover={{ y: -4, scale: 1.02, boxShadow: "0 20px 40px -15px rgba(0,0,0,0.3)" }}
          >
            <Link
              to={s.to}
              className="group bg-white/80 border border-slate-200 shadow-sm backdrop-blur-xl dark:bg-white/[0.03] dark:border-white/[0.08] dark:backdrop-blur-2xl p-6 rounded-[2rem] flex flex-col h-full transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-accent/10 border border-accent/20 grid place-items-center group-hover:bg-accent/20 transition-colors">
                  <s.icon className="h-5 w-5 text-accent" />
                </div>
                <ArrowRight className="h-4 w-4 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tighter mb-1">{s.value}</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">{s.label}</div>
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
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">{t.dashboard.quickActions}</h2>
          <div className="h-[2px] flex-1 bg-gradient-to-r from-accent/50 via-accent/5 to-transparent rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[220px] gap-5">
          {quickActions.map((a, i) => (
            <motion.div
              key={a.to}
              variants={item}
              whileHover={{ y: -8 }}
              whileTap={{ scale: 0.98 }}
              className={a.featured ? "md:col-span-2 lg:row-span-2 lg:h-full" : ""}
            >
              <Link
                to={a.to}
                className="group relative block h-full rounded-[2.5rem] overflow-hidden bg-white/80 border border-slate-200 shadow-sm backdrop-blur-xl dark:bg-white/[0.03] dark:border-white/[0.08] dark:backdrop-blur-2xl transition-all duration-500"
              >
                <div className="absolute inset-0 z-0">
                  <img 
                    src={a.image} 
                    alt={a.label} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 grayscale-[0.2] group-hover:grayscale-0" 
                  />
                  <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-all duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                </div>

                <div className="relative z-10 h-full p-8 flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div className={`rounded-2xl grid place-items-center bg-black/5 dark:bg-white/10 backdrop-blur-xl border border-black/10 dark:border-white/20 shadow-2xl group-hover:bg-accent group-hover:border-accent group-hover:shadow-[0_0_20px_rgba(var(--accent-rgb),0.4)] transition-all duration-500 ${a.featured ? "h-16 w-16" : "h-12 w-12"}`}>
                      <a.icon className={`transition-colors duration-500 ${a.featured ? "h-8 w-8" : "h-6 w-6"} ${a.featured ? "text-accent group-hover:text-neutral-950" : "text-neutral-950 dark:text-white group-hover:text-neutral-950"}`} />
                    </div>
                    {a.featured && (
                      <div className="px-4 py-2 rounded-xl bg-accent/20 backdrop-blur-md border border-accent/30 text-accent text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                        Active Widget
                      </div>
                    )}
                    <div className="h-10 w-10 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 grid place-items-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                      <ArrowRight className="h-5 w-5 text-neutral-950 dark:text-white ltr:rotate-0 rtl:rotate-180" />
                    </div>
                  </div>
                  
                  <div className={a.featured ? "mt-auto" : ""}>
                    {a.featured && (
                      <div className="mb-6 grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-md">
                          <div className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase font-black tracking-widest mb-1">Target GPA</div>
                          <div className="text-2xl font-black text-neutral-950 dark:text-white">4.00</div>
                        </div>
                        <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-md">
                          <div className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase font-black tracking-widest mb-1">Status</div>
                          <div className="text-sm font-black text-accent uppercase">On Track</div>
                        </div>
                      </div>
                    )}
                    <div className={`font-black text-white transition-colors duration-300 group-hover:text-accent ${a.featured ? "text-4xl mb-3" : "text-xl mb-1"}`}>
                      {a.label}
                    </div>
                    <div className={`text-neutral-200 leading-relaxed font-medium transition-colors duration-300 group-hover:text-white ${a.featured ? "text-lg max-w-sm" : "text-xs"}`}>
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
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">{t.dashboard.campusGuide || "Campus Guide"}</h2>
          <div className="h-px flex-1 mx-6 bg-gradient-to-r from-accent/40 to-transparent" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {buildings.map((b) => (
            <motion.a
              key={b.id}
              href={b.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -6 }}
              className="group bg-white/80 border border-slate-200 shadow-sm backdrop-blur-xl dark:bg-white/[0.03] dark:border-white/[0.08] dark:backdrop-blur-2xl overflow-hidden rounded-[2rem] flex flex-col transition-all duration-300"
            >
              <div className="h-40 w-full relative overflow-hidden">
                <img src={b.imageUrl} alt={b.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent" />
                <div className="absolute top-3 ltr:right-3 rtl:left-3 h-8 w-8 rounded-full bg-black/30 backdrop-blur-md grid place-items-center text-white border border-white/10">
                  <ExternalLink className="h-4 w-4" />
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col relative z-10 -mt-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-accent/20 border border-accent/30 grid place-items-center text-accent backdrop-blur-md shrink-0">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <h3 className="font-bold text-lg leading-tight text-slate-900 dark:text-slate-100">{lang === "ar" ? b.nameAr : b.name}</h3>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 flex-1">{lang === "ar" ? b.descriptionAr : b.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(lang === "ar" ? b.departmentsAr : b.departments).map((dept) => (
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
