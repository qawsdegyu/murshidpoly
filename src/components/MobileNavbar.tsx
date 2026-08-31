import React, { memo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { User, Settings, LogOut, Menu } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { isUserAdmin } from "@/lib/admin";
import { m } from "framer-motion";

interface MobileNavbarProps {
  onMenuToggle?: () => void;
  isMenuOpen?: boolean;
}

const MobileNavbar = memo(({ onMenuToggle, isMenuOpen }: MobileNavbarProps) => {
  const { user, signOut } = useAuth();
  const isAdmin = isUserAdmin(user?.email);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex w-full h-16 items-center justify-between px-4 pointer-events-none" dir="rtl">
      {/* Menu Button only */}
      <div className={`flex items-center gap-2 pointer-events-auto transition-opacity duration-200 ${isMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <button onClick={onMenuToggle} className="w-14 h-14 shrink-0 aspect-square flex items-center justify-center text-foreground bg-background/80 backdrop-blur-md border border-white/10 shadow-sm rounded-md hover:bg-white/5 transition-colors focus:outline-none">
          <Menu className="w-8 h-8" />
        </button>
      </div>
      
      {/* Logo on the left */}
      <div className={`flex items-center pointer-events-auto transition-opacity duration-200 ${isMenuOpen || isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <Link to="/" className="flex items-center active:scale-95 transition-transform">
          <img src="/rs.png" alt="Murshid Logo" className="h-10 object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]" onError={(e) => e.currentTarget.style.display = 'none'} />
        </Link>
      </div>
    </div>
  );
});

MobileNavbar.displayName = "MobileNavbar";
export default MobileNavbar;
