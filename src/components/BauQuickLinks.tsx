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

      <div className="flex flex-wrap items-center justify-center gap-4 px-4 sm:gap-6 py-2">
        {links.map((l, i) => {
          const label = lang === "ar" ? l.labelAr : l.label;
          return (
            <motion.li
              key={l.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ delay: 0.04 * i, duration: 0.3, ease: "easeOut" }}
              className="list-none"
            >
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="group flex flex-col items-center"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full bg-slate-100/50 dark:bg-slate-800/50 flex items-center justify-center transition-all duration-300 group-hover:bg-slate-200/80 dark:group-hover:bg-slate-700/80 shadow-sm border border-slate-200 dark:border-white/5">
                  <l.Icon className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-slate-700 dark:text-white transition-transform duration-300 group-hover:scale-110" strokeWidth={1.5} />
                </div>
                <span className="text-[10px] sm:text-xs font-black text-slate-800 dark:text-slate-200 mt-2 text-center max-w-[100px] sm:max-w-[110px] lg:max-w-[120px] leading-tight break-words">
                  {label}
                </span>
              </a>
            </motion.li>
          );
        })}
      </div>
    </section>
  );
}
