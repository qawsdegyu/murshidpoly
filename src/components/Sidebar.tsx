import { useState, memo, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, GraduationCap, BookOpen, Users, Calculator, ShoppingBag, Sparkles, Settings, Menu, X, MapPin,
} from "lucide-react";
import { usePreferences } from "@/contexts/PreferencesContext";
import { cn } from "@/lib/utils";

const Sidebar = memo(() => {
  const { t, dir } = usePreferences();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const activeRef = useRef<HTMLAnchorElement>(null);

  // Auto-scroll to active link when menu opens
  useEffect(() => {
    if (isOpen && activeRef.current) {
      const timer = setTimeout(() => {
        activeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);


  const items = [
    { to: "/", icon: LayoutDashboard, label: t.nav.dashboard, end: true },
    { to: "/majors", icon: GraduationCap, label: t.nav.majors },
    { to: "/vault", icon: BookOpen, label: t.nav.vault },
    { to: "/faculty", icon: Users, label: t.nav.faculty },
    { to: "/gpa", icon: Calculator, label: t.nav.gpa },
    { to: "/campus-map", icon: MapPin, label: t.nav.campusMap },
    { to: "/marketplace", icon: ShoppingBag, label: t.nav.marketplace },
    { to: "/recreation", icon: Sparkles, label: t.nav.recreation },
  ];

  const isActive = (to: string, end?: boolean) =>
    end ? location.pathname === to : location.pathname.startsWith(to);

  const sideClasses = cn(
    "fixed top-0 z-40 h-[100dvh] bg-sidebar/95 backdrop-blur-[20px] border-sidebar-border transition-all duration-500 flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.3)]",
    dir === "rtl" ? "right-0 border-l" : "left-0 border-r",
    "w-[50%] md:w-60", // Mobile: 50% width, Desktop: 60 (240px)
    isOpen ? "translate-x-0" : (dir === "rtl" ? "translate-x-full" : "-translate-x-full"),
  );

  return (
    <>
      {/* Universal toggle button (Top Right) */}
      <button
        onClick={() => setIsOpen(o => !o)}
        className={cn(
          "fixed top-3 z-50 p-2 rounded-xl bg-sidebar/80 border border-sidebar-border backdrop-blur-xl shadow-2xl transition-all duration-300 active:scale-90",
          dir === "rtl" ? "right-3" : "left-3"
        )}
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-5 w-5 text-foreground" /> : <Menu className="h-5 w-5 text-foreground" />}
      </button>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-md z-30" 
            onClick={() => setIsOpen(false)} 
          />
        )}
      </AnimatePresence>

      <aside className={sideClasses}>
        {/* Logo area - Highly compact */}
        <div className="p-3 md:p-4 flex items-center gap-2.5 border-b border-sidebar-border">
          <img 
            src="/rs.png" 
            alt="Murshid Logo" 
            className="h-9 w-9 md:h-10 md:w-10 rounded-full object-contain shadow-lg shrink-0 border border-accent/20"
            loading="lazy"
            decoding="async"
          />
          <div className="overflow-hidden">
            <div className="font-black text-lg md:text-xl tracking-tighter leading-none text-foreground">{t.appName}</div>
            <div className="text-[9px] font-bold text-accent mt-0.5 tracking-widest uppercase truncate">{t.tagline}</div>
          </div>
        </div>

        {/* Navigation Content - Maximum vertical space efficiency */}
        <nav className="flex-1 overflow-y-auto scrollbar-hide p-2 space-y-0.5 flex flex-col justify-center my-auto">
          {items.map((it) => {
            const active = isActive(it.to, it.end);
            return (
              <motion.div
                key={it.to}
                whileHover={{ scale: 1.01, x: dir === "rtl" ? -3 : 3 }}
                whileTap={{ scale: 0.99 }}
              >
                <Link
                  to={it.to}
                  ref={active ? activeRef : null}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "group relative flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all active-press w-full",
                    active
                      ? "gradient-primary text-primary-foreground shadow-md"
                      : "hover:bg-sidebar-accent text-sidebar-foreground/60 hover:text-sidebar-foreground"
                  )}
                >
                  <it.icon className={cn("h-[18px] w-[18px] shrink-0 transition-colors", active ? "text-primary-foreground" : "group-hover:text-accent")} />
                  <span className="font-bold text-[13px] whitespace-nowrap overflow-hidden text-ellipsis">{it.label}</span>
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Bottom actions - Minimalist */}
        <div className="p-3 border-t border-sidebar-border">
          <Link
            to="/settings"
            onClick={() => setIsOpen(false)}
            className={cn(
              "flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all w-full",
              isActive("/settings")
                ? "gradient-primary text-primary-foreground shadow-sm"
                : "hover:bg-sidebar-accent text-sidebar-foreground/60 hover:text-sidebar-foreground"
            )}
          >
            <Settings className="h-[18px] w-[18px] shrink-0" />
            <span className="font-bold text-[13px] whitespace-nowrap">{t.nav.settings}</span>
          </Link>
        </div>
      </aside>
    </>
  );
});

Sidebar.displayName = "Sidebar";

export default Sidebar;


