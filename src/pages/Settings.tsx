import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings as SettingsIcon, Palette, Languages, Sun, Moon, Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { usePreferences } from "@/contexts/PreferencesContext";
import { cn } from "@/lib/utils";

type TabId = "appearance" | "language";

export default function Settings() {
  const { t, theme, setTheme, lang, setLang } = usePreferences();
  const [tab, setTab] = useState<TabId>("appearance");

  const tabs: { id: TabId; label: string; icon: typeof Palette }[] = [
    { id: "appearance", label: t.settings.tabs.appearance, icon: Palette },
    { id: "language", label: t.settings.tabs.language, icon: Languages },
  ];

  return (
    <div className="max-w-4xl mx-auto w-full mt-6 md:mt-12">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mb-10 flex items-center gap-4"
      >
        <div className="relative h-14 w-14 rounded-2xl grid place-items-center bg-gradient-to-br from-primary to-primary/60 ring-1 ring-accent/40 shadow-[0_0_30px_hsl(var(--accent)/0.35)]">
          <div className="absolute inset-0 rounded-2xl bg-accent/10 blur-md" />
          <SettingsIcon className="relative h-7 w-7 text-accent drop-shadow-[0_0_8px_hsl(var(--accent)/0.6)]" />
        </div>
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-none">{t.settings.title}</h1>
          <p className="text-neutral-400 text-sm md:text-base mt-2">{t.settings.subtitle}</p>
        </div>
      </motion.header>

      {/* Segmented control — 2 tabs only */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="relative grid grid-cols-2 gap-1 p-2 rounded-2xl border border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-neutral-900/60 backdrop-blur-xl mb-8 shadow-sm dark:shadow-[0_8px_30px_rgb(0,0,0,0.35)]"
      >
        {tabs.map(({ id, label, icon: Icon }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={cn(
                "relative z-10 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-semibold transition-colors duration-300",
                active ? "text-white" : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
              )}
            >
              {active && (
                <motion.span
                  layoutId="settings-tab-pill"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  className="absolute inset-0 rounded-xl bg-[hsl(147_100%_15%)] shadow-[0_4px_18px_hsl(147_100%_15%/0.6),inset_0_1px_0_hsl(0_0%_100%/0.08)] ring-1 ring-accent/30"
                />
              )}
              <Icon className="relative h-4 w-4" />
              <span className="relative">{label}</span>
            </button>
          );
        })}
      </motion.div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {tab === "appearance" && (
          <motion.div
            key="appearance"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <Label className="mb-5 block text-neutral-700 dark:text-neutral-300 text-base">{t.settings.theme}</Label>
            <div className="grid sm:grid-cols-2 gap-5">
              <ThemeCard
                active={theme === "light"}
                onClick={() => setTheme("light")}
                title={t.settings.light}
                preview={
                  <div className="h-32 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-200 grid place-items-center">
                    <Sun className="h-10 w-10 text-amber-500" />
                  </div>
                }
              />
              <ThemeCard
                active={theme === "dark"}
                onClick={() => setTheme("dark")}
                title={t.settings.dark}
                preview={
                  <div className="h-32 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 grid place-items-center">
                    <Moon className="h-10 w-10 text-accent" />
                  </div>
                }
              />
            </div>
          </motion.div>
        )}

        {tab === "language" && (
          <motion.div
            key="language"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <Label className="mb-5 block text-neutral-700 dark:text-neutral-300 text-base">{t.settings.lang}</Label>
            <div className="grid sm:grid-cols-2 gap-5">
              <LanguageCard
                active={lang === "en"}
                onClick={() => setLang("en")}
                flag="🇬🇧"
                title={t.settings.english}
                subtitle="Left-to-right layout"
              />
              <LanguageCard
                active={lang === "ar"}
                onClick={() => setLang("ar")}
                flag="🇯🇴"
                title={t.settings.arabic}
                subtitle="تخطيط من اليمين إلى اليسار"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CornerCheck() {
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 380, damping: 22 }}
      className="absolute top-4 end-4 h-9 w-9 rounded-full grid place-items-center bg-accent text-accent-foreground shadow-[0_0_20px_hsl(var(--accent)/0.7)]"
    >
      <Check className="h-5 w-5 stroke-[3]" />
    </motion.div>
  );
}

interface ThemeCardProps {
  active: boolean;
  onClick: () => void;
  title: string;
  preview: React.ReactNode;
}
function ThemeCard({ active, onClick, title, preview }: ThemeCardProps) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative p-5 rounded-2xl border text-start transition-all duration-300 backdrop-blur-xl overflow-hidden",
        active
          ? "border-amber-500 bg-white dark:bg-neutral-900/60 shadow-[0_0_30px_hsl(var(--accent)/0.35),inset_0_0_30px_hsl(var(--accent)/0.08)]"
          : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/30 hover:-translate-y-1 hover:border-amber-500/50"
      )}
    >
      {preview}
      <div className={cn("font-bold text-lg mt-4", active ? "text-accent" : "text-neutral-700 dark:text-neutral-300")}>
        {title}
      </div>
      {active && <CornerCheck />}
    </motion.button>
  );
}

interface LanguageCardProps {
  active: boolean;
  onClick: () => void;
  flag: string;
  title: string;
  subtitle: string;
}
function LanguageCard({ active, onClick, flag, title, subtitle }: LanguageCardProps) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative p-8 rounded-2xl border text-start transition-all duration-300 backdrop-blur-xl overflow-hidden min-h-[180px]",
        active
          ? "border-amber-500 bg-white dark:bg-neutral-900/60 shadow-[0_0_36px_hsl(var(--accent)/0.4),inset_0_0_40px_hsl(var(--accent)/0.10)]"
          : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/30 hover:-translate-y-1 hover:border-amber-500/50"
      )}
    >
      {active && (
        <div className="absolute -bottom-16 -end-16 h-48 w-48 rounded-full bg-accent/20 blur-3xl pointer-events-none" />
      )}
      <div className="relative">
        <div className="text-5xl mb-4">{flag}</div>
        <div className={cn("font-bold text-2xl", active ? "text-accent" : "text-neutral-800 dark:text-neutral-200")}>
          {title}
        </div>
        <div className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">{subtitle}</div>
      </div>
      {active && <CornerCheck />}
    </motion.button>
  );
}
