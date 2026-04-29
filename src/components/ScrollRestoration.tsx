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
      window.scrollTo(0, 0);
    } else if (navigationType === "POP") {
      const savedY = scrollPositions.current[key];
      if (savedY !== undefined) {
        // Use a minimal timeout to ensure the DOM has updated
        const timer = setTimeout(() => {
          window.scrollTo({ top: savedY, behavior: "instant" });
        }, 0); 
        return () => clearTimeout(timer);
      }
    }
  }, [key, navigationType]);

  return null;
}

