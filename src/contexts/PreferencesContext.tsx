import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { Lang, translations, Translation } from "@/lib/i18n";

type Theme = "light" | "dark";

interface PreferencesValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  t: Translation;
  dir: "rtl" | "ltr";
}

const PreferencesContext = createContext<PreferencesValue | null>(null);

const LANG_KEY = "murshid:lang";
const THEME_KEY = "murshid:theme";

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === "undefined") return "ar";
    return (localStorage.getItem(LANG_KEY) as Lang) || "ar";
  });
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return "dark";
    return (localStorage.getItem(THEME_KEY) as Theme) || "dark";
  });

  const dir = "rtl"; // strictly RTL

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("dir", dir);
    root.setAttribute("lang", lang);
    localStorage.setItem(LANG_KEY, lang);
  }, [lang, dir]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const value = useMemo<PreferencesValue>(() => ({
    lang,
    setLang: setLangState,
    theme,
    setTheme: setThemeState,
    toggleTheme: () => setThemeState(t => t === "light" ? "dark" : "light"),
    t: translations[lang],
    dir,
  }), [lang, theme, dir]);

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error("usePreferences must be used within PreferencesProvider");
  return ctx;
}
