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
    href: "https://www.bau.edu.jo/Services/SServices.aspx",
    Icon: Globe,
    color: "text-blue-400",
    tile: "from-blue-700/40 to-blue-500/20",
  },
  {
    label: "Facebook",
    labelAr: "فيسبوك",
    href: "https://www.facebook.com/share/1KUSa9Fah7/",
    Icon: Facebook,
    color: "text-blue-500",
    tile: "from-blue-800/40 to-blue-600/20",
  },
  {
    label: "Instagram",
    labelAr: "إنستغرام",
    href: "https://www.instagram.com/al_balqaapplieduniversity?igsh=eDFteGcxZ3F6dnNq",
    Icon: Instagram,
    color: "text-blue-300",
    tile: "from-blue-500/40 to-blue-400/20",
  },
  {
    label: "E-Learning",
    labelAr: "التعليم الإلكتروني",
    href: "https://s3.ebalqa.courses/fet/login/index.php",
    Icon: GraduationCap,
    color: "text-blue-400",
    tile: "from-blue-700/40 to-blue-500/20",
  },
  {
    label: "Registration",
    labelAr: "التسجيل",
    href: "http://appserver.fet.edu.jo:7778/reg_new/index.jsp",
    Icon: Key,
    color: "text-blue-600",
    tile: "from-blue-900/40 to-blue-700/20",
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
      <div className="mb-6">
        <h2
          id="bau-quick-links"
          className="text-xl md:text-3xl font-black text-content tracking-tight"
        >
          {heading}
        </h2>
        <p className="text-sm text-content/60 mt-1 font-medium">{sub}</p>
      </div>

      <div className="bg-surface/80 border border-border shadow-sm backdrop-blur-xl dark:bg-surface/40 dark:border-white/10 dark:backdrop-blur-2xl rounded-[2rem] p-4 md:p-6 transition-all duration-300">
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
                  className="group relative flex items-center gap-2 p-3 rounded-xl bg-surface/50 dark:bg-surface/10 border border-border dark:border-white/10 hover:border-blue-500/70 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  {/* Blue glow on hover */}
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-blue-500/10 to-transparent transition-opacity duration-300 pointer-events-none" />

                  <span
                    className={`relative h-10 w-10 shrink-0 rounded-lg bg-gradient-to-br ${l.tile} grid place-items-center border border-white/10 shadow-inner`}
                  >
                    <l.Icon className={`h-5 w-5 ${l.color}`} strokeWidth={1.8} />
                  </span>

                  <span className="relative min-w-0 flex-1">
                    <span className="block text-xs font-black text-content group-hover:text-blue-500 transition-colors truncate">
                      {label}
                    </span>
                    <span className="block text-[8px] text-content/50 truncate font-medium">
                      {l.href.replace(/^https?:\/\//, "").split('/')[0]}
                    </span>
                  </span>

                  <ExternalLink className="relative h-3 w-3 text-content/40 group-hover:text-blue-500 shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                </a>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
