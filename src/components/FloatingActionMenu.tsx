import { useState } from "react";
import { Plus, BookOpen, MapPin, Calculator, Users, X } from "lucide-react";
import { m, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { usePreferences } from "@/contexts/PreferencesContext";
import { cn } from "@/lib/utils";
import { PAGE_IMPORTS, prefetchPage } from "@/lib/prefetch";

const FloatingActionMenu = () => {
  const { theme, lang, t, dir } = usePreferences();
  const [isOpen, setIsOpen] = useState(false);

  // Smart Color Adaptation Logic
  // Rule A (Dark): BG: #FFFFFF, Icon: #003366
  // Rule B (Light): BG: #003366, Icon: #FFFFFF
  // Rule C (Pink/Others): Adjust for contrast
  const isDark = theme === "dark";
  const isPink = theme === "pink";

  const buttonStyles = cn(
    "fixed bottom-6 z-50 h-14 w-14 rounded-full shadow-2xl transition-all duration-500 flex items-center justify-center hover:scale-110 active:scale-95 border-2 border-accent",
    dir === "rtl" ? "left-6" : "right-6",
    isOpen 
      ? "bg-accent text-accent-foreground shadow-[0_0_30px_hsl(var(--accent)/0.6)]" 
      : "bg-foreground text-background shadow-[0_0_20px_hsl(var(--accent)/0.3)] hover:bg-accent hover:text-accent-foreground"
  );

  const menuActions = [
    { to: "/vault", icon: BookOpen, label: lang === "ar" ? "خزانة المواد" : "Materials Vault", prefetch: PAGE_IMPORTS.Vault },
    { to: "/campus-map", icon: MapPin, label: lang === "ar" ? "مواقع المباني" : "Building Maps", prefetch: PAGE_IMPORTS.BuildingsPage },
    { to: "/gpa", icon: Calculator, label: lang === "ar" ? "حاسبة المعدل" : "GPA Calculator", prefetch: PAGE_IMPORTS.GPACalculator },
    { to: "/instructors", icon: Users, label: lang === "ar" ? "دليل المدرسين" : "Instructors List", prefetch: PAGE_IMPORTS.Faculty },
  ];

  return (
    <>
      {/* The FAB */}
      <m.button
        onClick={() => setIsOpen(true)}
        className={buttonStyles}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ rotate: 90 }}
        aria-label="Quick Actions"
      >
        <Plus className="h-8 w-8" strokeWidth={2.5} />
      </m.button>

      {/* The Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Modal Content */}
            <m.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className={cn(
                "relative w-full max-w-md p-6 rounded-[2.5rem] shadow-2xl border border-border overflow-hidden",
                "bg-card"
              )}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-foreground/5 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>

              <div className="mb-8 text-center">
                <h2 className="text-2xl font-black mb-2 text-foreground">
                  {lang === "ar" ? "الإجراءات السريعة" : "Quick Actions"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {lang === "ar" ? "وصول سريع لأهم الخدمات" : "Quick access to core services"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {menuActions.map((action) => (
                  <Link
                    key={action.to}
                    to={action.to}
                    onClick={() => setIsOpen(false)}
                    onMouseEnter={() => prefetchPage(action.prefetch)}
                    className={cn(
                      "flex flex-col items-center justify-center p-6 rounded-3xl transition-all hover:scale-105 active:scale-95 border",
                      isDark 
                        ? "bg-surface border-border text-foreground hover:bg-surface/80" 
                        : "bg-surface border-border text-foreground hover:bg-surface/80"
                    )}
                  >
                    <div className="h-12 w-12 rounded-2xl gradient-primary flex items-center justify-center text-primary-foreground mb-3 shadow-lg">
                      <action.icon className="h-6 w-6" />
                    </div>
                    <span className="font-bold text-sm text-center leading-tight">
                      {action.label}
                    </span>
                  </Link>
                ))}
              </div>
            </m.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingActionMenu;
