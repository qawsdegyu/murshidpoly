import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { Lang, getTranslations, Translation } from "@/lib/i18n";

type Theme = "light" | "dark" | "pink";
type FontSize = number; // Base pixel size

interface PreferencesValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  fontSize: FontSize;
  setFontSize: (s: FontSize) => void;
  toggleTheme: () => void;
  t: Translation;
  dir: "rtl" | "ltr";
}

const PreferencesContext = createContext<PreferencesValue | null>(null);

const LANG_KEY = "murshid:lang";
const THEME_KEY = "murshid:theme";
const FONT_SIZE_KEY = "murshid:font-size";

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === "undefined") return "ar";
    return (localStorage.getItem(LANG_KEY) as Lang) || "ar";
  });
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return "dark";
    return (localStorage.getItem(THEME_KEY) as Theme) || "dark";
  });
  const [fontSize, setFontSize] = useState<FontSize>(() => {
    if (typeof window === "undefined") return 16;
    const saved = localStorage.getItem(FONT_SIZE_KEY);
    return saved ? parseInt(saved, 10) : 16;
  });

  // Dynamic RTL/LTR Enforcement
  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("dir", dir);
    root.setAttribute("lang", lang);
    localStorage.setItem(LANG_KEY, lang);
  }, [lang, dir]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.remove("dark");
    } else {
      root.classList.add("dark");
    }
    root.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.fontSize = `${fontSize}px`;
    localStorage.setItem(FONT_SIZE_KEY, fontSize.toString());
  }, [fontSize]);

  const value = useMemo<PreferencesValue>(() => ({
    lang,
    setLang: setLangState,
    theme,
    setTheme: setThemeState,
    fontSize,
    setFontSize,
    toggleTheme: () => setThemeState(prev => {
      if (prev === "light") return "dark";
      if (prev === "dark") return "pink";
      return "light";
    }),
    t: getTranslations(lang),
    dir,
  }), [lang, theme, fontSize, dir]);

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error("usePreferences must be used within PreferencesProvider");
  return ctx;
}
