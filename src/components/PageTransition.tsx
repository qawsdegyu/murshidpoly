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
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.15, 
        ease: "easeOut"
      }}
      className="w-full h-full will-change-[transform,opacity]"
    >
      {children}
    </m.div>
  );
};

export default PageTransition;
