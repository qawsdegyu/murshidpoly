import { memo } from "react";
import { Menu, X } from "lucide-react";
import { usePreferences } from "@/contexts/PreferencesContext";
import { cn } from "@/lib/utils";

interface TopHeaderProps {
  onMenuToggle: () => void;
  isMenuOpen: boolean;
}

const TopHeader = memo(({ onMenuToggle, isMenuOpen }: TopHeaderProps) => {
  const { t, dir } = usePreferences();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none" dir={dir}>
      <div className="relative w-full h-24 px-4 md:px-8">
        {/* Menu button Section - Floating Top Right */}
        <button
          onClick={onMenuToggle}
          className={cn(
            "fixed top-4 right-4 z-50 pointer-events-auto",
            "h-14 w-14 rounded-full flex items-center justify-center transition-all active:scale-90",
            "bg-[#001a33] text-[#00ffff] shadow-[0_0_20px_rgba(0,255,255,0.1)] border-2 border-[#00ffff]",
            isMenuOpen && "rotate-90 bg-[#001a33] text-white border-white shadow-[0_0_30px_rgba(255,255,255,0.2)]"
          )}
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
        </button>
      </div>
    </header>
  );
});

TopHeader.displayName = "TopHeader";

export default TopHeader;
