import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

/**
 * ScrollRestoration component manages scroll behavior globally.
 * - For new navigations (PUSH), it scrolls to top.
 * - For back/forward (POP), it restores the previous scroll position from a local cache.
 */
export default function ScrollRestoration() {
  const { pathname, key } = useLocation();
  const navigationType = useNavigationType();
  
  // Persist scroll positions for different history entries
  const scrollPositions = useRef<Record<string, number>>({});

  useEffect(() => {
    const handleScroll = () => {
      scrollPositions.current[key] = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [key]);

  useEffect(() => {
    if (navigationType === "PUSH") {
      // New navigation: jump to top
      window.scrollTo(0, 0);
    } else if (navigationType === "POP") {
      // Back/Forward: restore saved position
      const savedY = scrollPositions.current[key];
      if (savedY !== undefined) {
        // Master layout - scroll to top is now handled by the ScrollRestoration component
        // to allow for intelligent back-button restoration.
        const timer = setTimeout(() => {
          window.scrollTo({ top: savedY, behavior: "instant" });
        }, 150); // Increased delay to ensure AnimatePresence/Page content is ready
        return () => clearTimeout(timer);

      }
    }
  }, [key, navigationType, pathname]);

  return null;
}

