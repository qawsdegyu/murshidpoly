import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * PageTransition component provides a lightweight, snappy fade-in transition
 * using standard CSS for maximum performance.
 */
const PageTransition = ({ children }: PageTransitionProps) => {
  return (
    <div className="animate-in fade-in duration-300 fill-mode-forward w-full h-full">
      {children}
    </div>
  );
};

export default PageTransition;
