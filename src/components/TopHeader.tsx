import { memo } from "react";
import DesktopNavbar from "./DesktopNavbar";
import MobileNavbar from "./MobileNavbar";

interface TopHeaderProps {
  isMenuOpen?: boolean;
  onMenuToggle?: () => void;
}

const TopHeader = memo(({ isMenuOpen, onMenuToggle }: TopHeaderProps) => {
  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:block fixed top-0 left-0 right-0 z-[100] bg-background/40 backdrop-blur-md border-b border-white/10 shadow-sm">
        <DesktopNavbar />
      </div>

      {/* Mobile Navigation */}
      <div className="block md:hidden fixed top-0 left-0 right-0 z-[100] pointer-events-none">
        <MobileNavbar onMenuToggle={onMenuToggle} isMenuOpen={isMenuOpen} />
      </div>
    </>
  );
});

TopHeader.displayName = "TopHeader";

export default TopHeader;
