import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollRestoration component manages scroll behavior globally.
 * - Instantly resets viewport scroll to top on every pathname change.
 * - Applies a 50ms delayed scroll reset fallback to ensure any dynamic rendering or transition settles correctly at the top.
 */
export default function ScrollRestoration() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
    }, 50);
    
    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}

