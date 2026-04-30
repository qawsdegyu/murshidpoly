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
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="max-w-4xl mx-auto w-full pt-28 pb-10"
    >
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mb-10 flex items-center gap-4"
      >
        <div className="relative h-14 w-14 rounded-2xl grid place-items-center bg-gradient-to-br from-primary to-primary/60 ring-1 ring-accent/40 shadow-[0_0_30px_hsl(var(--accent)/0.35)]">
          <div className="absolute inset-0 rounded-2xl bg-accent/10 blur-md" />
          <SettingsIcon className="relative h-7 w-7 text-primary-foreground drop-shadow-[0_0_8px_hsl(var(--accent)/0.6)]" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-none text-content">{t.settings.title}</h1>
          <p className="text-content/60 text-sm md:text-base mt-2 font-medium">{t.settings.subtitle}</p>
        </div>
      </motion.header>

      {/* Segmented control — 2 tabs only */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="relative grid grid-cols-2 gap-1 p-2 rounded-2xl border border-border bg-surface/50 dark:bg-surface/10 backdrop-blur-xl mb-8 shadow-sm"
      >
        {tabs.map(({ id, label, icon: Icon }) => {
          const active = tab === id;
          return (
            <motion.button
              key={id}
              onClick={() => setTab(id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "relative z-10 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-semibold transition-colors duration-300",
                active ? "text-primary-foreground" : "text-content/50 hover:text-content"
              )}
            >
              {active && (
                <motion.span
                  layoutId="settings-tab-pill"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  className="absolute inset-0 rounded-xl bg-primary shadow-[0_4px_18px_hsl(var(--primary)/0.4),inset_0_1px_0_hsl(0_0%_100%/0.08)] ring-1 ring-primary/30"
                />
              )}
              <Icon className="relative h-4 w-4" />
              <span className="relative">{label}</span>
            </motion.button>
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
            <Label className="mb-5 block text-foreground text-base font-black">{t.settings.theme}</Label>
            
            {/* Segmented Theme Switcher */}
            <div className="relative p-1.5 rounded-2xl bg-surface/50 border border-border backdrop-blur-xl grid grid-cols-3 gap-1 mb-8 shadow-inner overflow-hidden">
              {(["light", "dark", "pink"] as const).map((tId) => {
                const isActive = theme === tId;
                return (
                  <button
                    key={tId}
                    onClick={() => setTheme(tId)}
                    className={cn(
                      "relative py-3 rounded-xl text-sm font-black transition-all duration-500 z-10",
                      isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-theme-segment"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="absolute inset-0 bg-primary rounded-xl shadow-lg ring-1 ring-white/10"
                      />
                    )}
                    <span className="relative z-20 uppercase tracking-widest flex items-center justify-center gap-2">
                      {tId === "light" && <Sun className="h-4 w-4" />}
                      {tId === "dark" && <Moon className="h-4 w-4" />}
                      {tId === "pink" && <Palette className="h-4 w-4" />}
                      {tId === "light" ? t.settings.light : tId === "dark" ? t.settings.dark : t.settings.pink}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="grid sm:grid-cols-3 gap-5 opacity-50 pointer-events-none">
              <ThemeCard
                active={theme === "light"}
                onClick={() => setTheme("light")}
                title={t.settings.light}
                preview={
                  <div className="h-24 rounded-2xl bg-white border border-slate-200 grid place-items-center">
                    <Sun className="h-8 w-8 text-cyan-500" />
                  </div>
                }
              />
              <ThemeCard
                active={theme === "dark"}
                onClick={() => setTheme("dark")}
                title={t.settings.dark}
                preview={
                  <div className="h-24 rounded-2xl bg-black border border-white/10 grid place-items-center">
                    <Moon className="h-8 w-8 text-cyan-400" />
                  </div>
                }
              />
              <ThemeCard
                active={theme === "pink"}
                onClick={() => setTheme("pink")}
                title={t.settings.pink}
                preview={
                  <div className="h-24 rounded-2xl bg-[#D81B60] border border-white/10 grid place-items-center">
                    <Palette className="h-8 w-8 text-white" />
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
            <Label className="mb-5 block text-foreground text-base">{t.settings.lang}</Label>
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
    </motion.div>
  );
}

function CornerCheck() {
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 380, damping: 22 }}
      className="absolute top-4 end-4 h-9 w-9 rounded-full grid place-items-center bg-primary text-primary-foreground shadow-[0_0_20px_hsl(var(--primary)/0.7)]"
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
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative p-5 rounded-2xl border text-start transition-all duration-300 backdrop-blur-xl overflow-hidden",
        active
          ? "border-primary bg-surface shadow-[0_0_30px_hsl(var(--primary)/0.2),inset_0_0_30px_hsl(var(--primary)/0.05)]"
          : "border-border bg-card hover:border-primary/50 text-foreground"
      )}
    >
      {preview}
      <div className={cn("font-black text-lg mt-4", active ? "text-primary" : "text-content")}>
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
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative p-8 rounded-2xl border text-start transition-all duration-300 backdrop-blur-xl overflow-hidden min-h-[180px]",
        active
          ? "border-primary bg-surface shadow-[0_0_36px_hsl(var(--primary)/0.2),inset_0_0_40px_hsl(var(--primary)/0.05)]"
          : "border-border bg-card hover:border-primary/50 text-foreground"
      )}
    >
      {active && (
        <div className="absolute -bottom-16 -end-16 h-48 w-48 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
      )}
      <div className="relative">
        <div className="text-5xl mb-4">{flag}</div>
        <div className={cn("font-black text-2xl", active ? "text-primary" : "text-content")}>
          {title}
        </div>
        <div className="text-sm text-content/60 mt-2 font-medium">{subtitle}</div>
      </div>
      {active && <CornerCheck />}
    </motion.button>
  );
}
