import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ScrollToTopProps {
  isNavbarVisible?: boolean;
}

export default function ScrollToTop({ isNavbarVisible = true }: ScrollToTopProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={cn(
        "fixed left-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600/90 text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-blue-500 active:scale-95",
        isNavbarVisible ? "bottom-24 md:bottom-6" : "bottom-6",
        "md:bottom-6"
      )}
      aria-label="العودة للأعلى"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </button>
  );
}
