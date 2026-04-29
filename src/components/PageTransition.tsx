import { ReactNode } from "react";
import { m } from "framer-motion";

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * PageTransition component provides a lightweight, snappy fade-in transition
 * using Framer Motion for seamless entry and exit.
 */
const PageTransition = ({ children }: PageTransitionProps) => {
  return (
    <m.div 
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
      className="w-full h-full"
    >
      {children}
    </m.div>
  );
};

export default PageTransition;
