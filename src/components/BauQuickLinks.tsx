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
          className="text-xl md:text-3xl font-black text-[#0F172A] dark:text-[#F8FAFC] tracking-tight"
        >
          {heading}
        </h2>
        <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mt-1 font-medium">{sub}</p>
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
                className="group flex flex-col items-center gap-3"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full bg-[#F8FAFC] dark:bg-[#1E293B] flex items-center justify-center transition-all duration-500 group-hover:bg-[#E2E8F0] dark:group-hover:bg-[#0F172A] shadow-sm border border-[#CBD5E1] dark:border-[#334155] dark:group-hover:border-[#14B8A6]">
                  <l.Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-9 md:h-9 lg:w-10 lg:h-10 text-[#0F172A] dark:text-[#F8FAFC] transition-transform duration-500 group-hover:scale-110" strokeWidth={1.5} />
                </div>
                <span className="text-xs sm:text-sm md:text-base font-black text-[#0F172A] dark:text-[#F8FAFC] text-center max-w-[110px] sm:max-w-[130px] md:max-w-[150px] lg:max-w-[180px] leading-tight break-words transition-colors group-hover:text-[#14B8A6] dark:group-hover:text-[#14B8A6]">
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
