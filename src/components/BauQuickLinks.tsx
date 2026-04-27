import { motion } from "framer-motion";
import { Globe, Facebook, Instagram, GraduationCap, Key, ExternalLink } from "lucide-react";
import { usePreferences } from "@/contexts/PreferencesContext";

interface QuickLink {
  label: string;
  labelAr: string;
  href: string;
  Icon: typeof Globe;
  /** Tailwind text color class for the icon accent. */
  color: string;
  /** Tailwind bg gradient classes for the icon tile. */
  tile: string;
}

const links: QuickLink[] = [
  {
    label: "Official Website",
    labelAr: "الموقع الرسمي",
    href: "https://bau.edu.jo",
    Icon: Globe,
    color: "text-emerald-400",
    tile: "from-emerald-700/40 to-emerald-500/20",
  },
  {
    label: "Facebook",
    labelAr: "فيسبوك",
    href: "https://www.facebook.com/bau.edu.jo",
    Icon: Facebook,
    color: "text-blue-400",
    tile: "from-blue-700/40 to-blue-500/20",
  },
  {
    label: "Instagram",
    labelAr: "إنستغرام",
    href: "https://www.instagram.com/bau_edu_jo",
    Icon: Instagram,
    color: "text-pink-400",
    tile: "from-pink-600/40 to-rose-500/20",
  },
  {
    label: "E-Learning",
    labelAr: "التعليم الإلكتروني",
    href: "https://elearning.bau.edu.jo",
    Icon: GraduationCap,
    color: "text-amber-400",
    tile: "from-amber-600/40 to-yellow-500/20",
  },
  {
    label: "Registration",
    labelAr: "التسجيل",
    href: "https://reg.bau.edu.jo",
    Icon: Key,
    color: "text-purple-400",
    tile: "from-purple-700/40 to-fuchsia-500/20",
  },
];

export default function BauQuickLinks() {
  const { lang } = usePreferences();
  const heading = lang === "ar" ? "بوابة البوليتكنك السريعة" : "Polytechnic Quick Access";
  const sub =
    lang === "ar"
      ? "روابط رسمية مختارة لكلية الهندسة التكنولوجية (البوليتكنك) – ماركا"
      : "Curated official links for the Faculty of Engineering Technology (Polytechnic) – Marka";

  return (
    <section aria-labelledby="bau-quick-links" className="font-cairo">
      <div className="mb-4">
        <h2
          id="bau-quick-links"
          className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight"
        >
          {heading}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{sub}</p>
      </div>

      <div className="bg-white/80 border border-slate-200 shadow-sm backdrop-blur-xl dark:bg-white/[0.03] dark:border-white/[0.08] dark:backdrop-blur-2xl rounded-2xl p-4 md:p-5">
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {links.map((l, i) => {
            const label = lang === "ar" ? l.labelAr : l.label;
            return (
              <motion.li
                key={l.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 * i, duration: 0.35, ease: "easeOut" }}
              >
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="group relative flex items-center gap-3 p-3 rounded-xl bg-white/50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.05] hover:border-accent/70 hover:-translate-y-1 hover:shadow-gold transition-all duration-300 overflow-hidden"
                >
                  {/* Gold glow on hover */}
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-accent/15 to-transparent transition-opacity duration-300 pointer-events-none" />

                  <span
                    className={`relative h-10 w-10 shrink-0 rounded-lg bg-gradient-to-br ${l.tile} grid place-items-center border border-white/10 shadow-inner`}
                  >
                    <l.Icon className={`h-5 w-5 ${l.color}`} strokeWidth={1.8} />
                  </span>

                  <span className="relative min-w-0 flex-1">
                    <span className="block text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-accent transition-colors truncate">
                      {label}
                    </span>
                    <span className="block text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {l.href.replace(/^https?:\/\//, "")}
                    </span>
                  </span>

                  <ExternalLink className="relative h-3.5 w-3.5 text-muted-foreground group-hover:text-accent shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                </a>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
