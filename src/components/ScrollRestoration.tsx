import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollRestoration component ensures the page scrolls to top on every route change.
 * This prevents the "black screen" or "off-screen render" issues in React apps.
 */
export default function ScrollRestoration() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Immediate scroll to top
    window.scrollTo(0, 0);
    
    // Safety timeout for dynamic content height calculation
    const timeoutId = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [pathname]);

  return null;
}
