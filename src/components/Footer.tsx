import { Instagram, Facebook, Linkedin, Globe } from "lucide-react";
import { usePreferences } from "@/contexts/PreferencesContext";

const socials = [
  { href: "https://instagram.com", label: "Instagram", Icon: Instagram },
  { href: "https://facebook.com", label: "Facebook", Icon: Facebook },
  { href: "https://linkedin.com", label: "LinkedIn", Icon: Linkedin },
  { href: "https://murshid.app", label: "Website", Icon: Globe },
];

export default function Footer() {
  const { lang } = usePreferences();
  return (
    <footer className="relative mt-auto w-full flex justify-center pb-8 pt-10 pointer-events-none">
      <div className="pointer-events-auto rounded-full border border-white/10 bg-neutral-900/40 backdrop-blur-xl px-6 py-3 flex items-center justify-between gap-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
        <p className="text-xs font-medium tracking-wide text-neutral-300">
          {lang === "ar" ? "مدعوم من " : "Powered by "}
          <span className="text-shimmer font-bold tracking-wider">Murshid</span>
        </p>

        <ul className="flex items-center gap-3">
          {socials.map(({ href, label, Icon }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="group flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-neutral-400 hover:text-accent hover:border-accent/40 hover:bg-accent/10 hover:-translate-y-0.5 transition-all shadow-[0_4px_15px_rgb(0,0,0,0.1)]"
              >
                <Icon className="h-4 w-4 transition-colors" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
