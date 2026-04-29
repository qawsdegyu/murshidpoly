import { useState, memo, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
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
    { to: "/gpa", icon: Calculator, label: t.nav.gpa },
    { to: "/campus-map", icon: MapPin, label: t.nav.campusMap },
    { to: "/marketplace", icon: ShoppingBag, label: t.nav.marketplace },
    { to: "/recreation", icon: Sparkles, label: t.nav.recreation },
  ];

  const isActive = (to: string, end?: boolean) =>
    end ? location.pathname === to : location.pathname.startsWith(to);

  const sideClasses = cn(
    "fixed top-0 z-40 h-screen bg-sidebar/95 backdrop-blur-[20px] border-sidebar-border transition-all duration-500 flex flex-col shadow-2xl",
    dir === "rtl" ? "right-0 border-l" : "left-0 border-r",
    "w-[55%] md:w-60", // Strict width: 55% Mobile, 240px Desktop
    isOpen ? "translate-x-0" : (dir === "rtl" ? "translate-x-full" : "-translate-x-full"),
  );

  return (
    <>
      {/* Universal toggle button (Top Right) */}
      <button
        onClick={() => setIsOpen(o => !o)}
        className={cn(
          "fixed top-2 z-50 p-1.5 rounded-lg bg-sidebar/80 border border-sidebar-border backdrop-blur-xl shadow-2xl transition-all duration-300 active:scale-90",
          dir === "rtl" ? "right-2" : "left-2"
        )}
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-4.5 w-4.5 text-foreground" /> : <Menu className="h-4.5 w-4.5 text-foreground" />}
      </button>

      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-background/80 backdrop-blur-md z-30 transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)} 
      />

      <aside className={sideClasses}>
        {/* Logo area - Highly compact */}
        <div className="p-2 md:p-3 flex items-center gap-2 border-b border-sidebar-border">
          <img 
            src="/rs.png" 
            alt="Murshid Logo" 
            className="h-8 w-8 md:h-9 md:w-9 rounded-full object-contain shadow-lg shrink-0 border border-accent/20"
            loading="lazy"
            decoding="async"
          />
          <div className="overflow-hidden">
            <div className="font-black text-base md:text-lg tracking-tighter leading-none text-foreground">{t.appName}</div>
            <div className="text-[8px] font-bold text-accent mt-0.5 tracking-widest uppercase truncate">{t.tagline}</div>
          </div>
        </div>

        {/* Navigation Content - Maximum vertical space efficiency */}
        <nav className="flex-1 overflow-y-auto scrollbar-hide p-1.5 space-y-1 flex flex-col">
          {items.map((it) => {
            const active = isActive(it.to, it.end);
            return (
              <div key={it.to} className="w-full transition-transform active:scale-95 duration-200">
                <Link
                  to={it.to}
                  ref={active ? activeRef : null}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "group relative flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg transition-all active-press w-full",
                    active
                      ? "gradient-primary text-primary-foreground shadow-md"
                      : "hover:bg-sidebar-accent text-sidebar-foreground/60 hover:text-sidebar-foreground"
                  )}
                >
                  <it.icon className={cn("h-[18px] w-[18px] shrink-0 transition-colors", active ? "text-primary-foreground" : "group-hover:text-accent")} />
                  <span className="font-bold text-sm whitespace-nowrap overflow-hidden text-ellipsis">{it.label}</span>
                </Link>
              </div>
            );
          })}
        </nav>

        {/* Bottom actions - Minimalist */}
        <div className="p-2 border-t border-sidebar-border">
          <Link
            to="/settings"
            onClick={() => setIsOpen(false)}
            className={cn(
              "flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all w-full",
              isActive("/settings")
                ? "gradient-primary text-primary-foreground shadow-sm"
                : "hover:bg-sidebar-accent text-sidebar-foreground/60 hover:text-sidebar-foreground"
            )}
          >
            <Settings className="h-[18px] w-[18px] shrink-0" />
            <span className="font-bold text-sm whitespace-nowrap">{t.nav.settings}</span>
          </Link>
        </div>
      </aside>
    </>
  );
});

Sidebar.displayName = "Sidebar";

export default Sidebar;


