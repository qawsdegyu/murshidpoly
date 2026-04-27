import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * PageTransition component provides a hyper-smooth, cinematic transition
 * with hardware acceleration and blur effects for a "Velvet" feel.
 */
const PageTransition = ({ children }: PageTransitionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 1.01 }}
      transition={{ 
        duration: 0.15, 
        ease: [0.16, 1, 0.3, 1] 
      }}
      style={{ 
        willChange: "opacity, transform",
        backfaceVisibility: "hidden",
        WebkitFontSmoothing: "antialiased"
      }}
      className="w-full min-h-screen flex flex-col"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
