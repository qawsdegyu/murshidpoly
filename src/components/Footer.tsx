import { useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { usePreferences } from "@/contexts/PreferencesContext";
import { Link } from "react-router-dom";
import { ChevronDown, Facebook, Instagram, MessageCircle } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { cn } from "@/lib/utils";

export default function Footer() {
  const { lang, t, dir } = usePreferences();
  const currentYear = new Date().getFullYear();
  const settings = useSiteSettings();
  const [openSection, setOpenSection] = useState<number | null>(null);

  const toggleSection = (idx: number) => {
    setOpenSection(openSection === idx ? null : idx);
  };

  return (
    <footer className="w-full mt-auto bg-[#F1F5F9] dark:bg-[#070A13] text-[#64748B] dark:text-[#94A3B8] py-12 px-6 lg:px-12 relative z-0 border-t border-[#E2E8F0] dark:border-[#334155]" dir={dir}>
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 md:gap-12">
          {t.footer.sections.map((section, idx) => {
            const isSupport = idx === 3;
            const isOpen = openSection === idx;

            const renderLinks = () => (
              <>
                {section.items.map((item, itemIdx) => (
                  <li key={itemIdx}>
                    {item.path.startsWith("http") ? (
                      <a href={item.path} target="_blank" rel="noopener noreferrer" className="text-[#64748B] dark:text-[#94A3B8] hover:text-[#14B8A6] dark:hover:text-[#14B8A6] hover:underline text-sm font-['Cairo'] transition-colors block py-1 md:py-0">
                        {item.name}
                      </a>
                    ) : (
                      <Link to={item.path} className="text-[#64748B] dark:text-[#94A3B8] hover:text-[#14B8A6] dark:hover:text-[#14B8A6] hover:underline text-sm font-['Cairo'] transition-colors block py-1 md:py-0">
                        {item.name}
                      </Link>
                    )}
                  </li>
                ))}
              </>
            );

            return (
              <div key={idx} className={cn("flex flex-col", "border-b border-[#E2E8F0] dark:border-[#334155] md:border-none")}>
                
                {/* Desktop View */}
                <div className="hidden md:block">
                  <h3 className="font-bold text-base lg:text-lg mb-4 font-['Cairo'] text-[#0F172A] dark:text-[#F8FAFC]">{section.title}</h3>
                  <ul className="flex flex-col gap-2">
                    {renderLinks()}
                  </ul>
                </div>

                {/* Mobile View */}
                <div className="block md:hidden w-full">
                  <button 
                    className="flex items-center justify-between w-full py-2.5 text-[#0F172A] dark:text-[#F8FAFC] font-['Cairo'] font-bold text-sm"
                    onClick={() => toggleSection(idx)}
                  >
                    <span>{section.title}</span>
                    <ChevronDown className={cn("w-3.5 h-3.5 transition-transform text-[#64748B] dark:text-[#94A3B8]", isOpen ? "rotate-180 text-[#0F172A] dark:text-[#F8FAFC]" : "")} />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <m.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden flex flex-col gap-1.5 pb-2"
                      >
                        {renderLinks()}
                      </m.ul>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>

        {/* Social icons sit directly on the divider, above the copyright row */}
        <div className="relative mt-8 md:mt-16">
          <div className="absolute z-10 -top-5 left-1/2 -translate-x-1/2 flex items-center justify-center gap-2 rounded-full bg-[#070A13] px-3" aria-label="روابط التواصل">
            {[
              { key: 'instagram_url', label: 'Instagram', Icon: Instagram, color: 'hover:text-pink-500' },
              { key: 'whatsapp_url', label: 'WhatsApp', Icon: MessageCircle, color: 'hover:text-emerald-500' },
              { key: 'facebook_url', label: 'Facebook', Icon: Facebook, color: 'hover:text-blue-500' },
            ].filter((item) => settings[item.key]).map(({ key, label, Icon, color }) => (
              <a key={key} href={settings[key]} target="_blank" rel="noopener noreferrer" aria-label={label} className={cn('w-8 h-8 rounded-full border border-[#CBD5E1] dark:border-[#334155] flex items-center justify-center text-[#64748B] dark:text-[#94A3B8] transition-colors', color)}><Icon className="w-4 h-4" /></a>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="relative pt-6 md:pt-8 border-t border-[#E2E8F0] dark:border-[#334155] flex flex-col md:grid md:grid-cols-3 items-center gap-5 md:gap-4">
          
          <div className="flex items-center justify-center gap-3 w-full md:w-auto md:justify-self-start order-1 md:order-1 mt-1 md:mt-0">
             <Link to="/auth" className="text-[11px] md:text-sm text-[#64748B] dark:text-[#94A3B8] hover:text-[#14B8A6] transition-colors font-['Cairo'] flex items-center">{t.footer.bottom.login}</Link>
             <span className="text-[#64748B] dark:text-[#94A3B8] text-[11px] md:text-sm flex items-center mb-0.5">|</span>
             <Link to="/majors" className="text-[11px] md:text-sm text-[#64748B] dark:text-[#94A3B8] hover:text-[#14B8A6] transition-colors font-['Cairo'] flex items-center">{t.footer.bottom.majors}</Link>
             <span className="text-[#64748B] dark:text-[#94A3B8] text-[11px] md:text-sm flex items-center mb-0.5">|</span>
             <Link to="/vault" className="text-[11px] md:text-sm text-[#64748B] dark:text-[#94A3B8] hover:text-[#14B8A6] transition-colors font-['Cairo'] flex items-center">{t.footer.bottom.vault}</Link>
          </div>

          <div className="flex items-center justify-center gap-2.5 md:gap-4 w-full md:w-auto md:justify-self-end order-2 md:order-3">
            <span className="hidden md:inline text-[#CBD5E1] dark:text-[#475569]">·</span>
            <p className="text-[10px] md:text-xs font-bold text-[#64748B] dark:text-[#94A3B8] font-['Cairo']">
              {lang === "ar" ? `© ${currentYear} ${t.footer.bottom.rights}` : `© ${currentYear} ${t.footer.bottom.rights}`}
            </p>
            <img src="/rs.png" alt="Murshid Logo" className="h-6 md:h-8 object-contain transition-all duration-300 drop-shadow-md" onError={(e) => e.currentTarget.style.display = 'none'} />
          </div>

          <div dir="ltr" className="order-3 flex w-full shrink-0 items-center justify-center md:w-auto md:justify-self-center md:order-2" aria-label="Powered by Operix">
            <a href={settings.powered_by_url || 'https://www.operixsys.online/'} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center whitespace-nowrap text-[10px] font-bold leading-none text-[#64748B] dark:text-[#94A3B8] font-['Cairo'] hover:text-[#14B8A6] hover:underline transition-colors md:text-xs" aria-label="Powered by Operix">Powered by&nbsp;Operix</a>
          </div>
        </div>
      </div>
      
      <div className="h-[120px] md:h-0" />
    </footer>
  );
}
