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
  return <>{children}</>;
};

export default PageTransition;
