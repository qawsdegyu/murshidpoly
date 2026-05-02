import { memo, useState } from "react";
import { Menu, X } from "lucide-react";
import { usePreferences } from "@/contexts/PreferencesContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface TopHeaderProps {
  onMenuToggle: () => void;
  isMenuOpen: boolean;
}

const TopHeader = memo(({ onMenuToggle, isMenuOpen }: TopHeaderProps) => {
  const { dir } = usePreferences();
  
  // Persistence logic for Menu button position
  const [position, setPosition] = useState(() => {
    try {
      const saved = localStorage.getItem("murshid_menu_pos");
      return saved ? JSON.parse(saved) : { x: 0, y: 0 };
    } catch {
      return { x: 0, y: 0 };
    }
  });

  const handleDragEnd = (_: any, info: any) => {
    const newPos = { 
      x: position.x + info.offset.x, 
      y: position.y + info.offset.y 
    };
    setPosition(newPos);
    localStorage.setItem("murshid_menu_pos", JSON.stringify(newPos));
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none" dir={dir}>
      <div className="relative w-full h-24 px-4 md:px-8">
        {/* Menu button Section - Floating Top Right */}
        <motion.button
          drag
          dragMomentum={false}
          dragElastic={0.1}
          onDragEnd={handleDragEnd}
          animate={{ x: position.x, y: position.y }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ touchAction: "none" }}
          onClick={onMenuToggle}
          className={cn(
            "fixed top-4 right-4 z-[100] pointer-events-auto cursor-grab active:cursor-grabbing",
            "h-14 w-14 rounded-full flex items-center justify-center transition-colors duration-300 will-change-transform",
            "bg-card/80 text-accent border-2 border-accent shadow-[0_0_20px_hsl(var(--accent)/0.3)] backdrop-blur-xl",
            isMenuOpen && "bg-card text-secondary border-secondary shadow-[0_0_30px_hsl(var(--secondary)/0.4)]"
          )}
          aria-label="Toggle Menu"
        >
          <motion.div animate={{ rotate: isMenuOpen ? 90 : 0 }} transition={{ duration: 0.3 }}>
            {isMenuOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
          </motion.div>
        </motion.button>
      </div>
    </header>
  );
});

TopHeader.displayName = "TopHeader";

export default TopHeader;
