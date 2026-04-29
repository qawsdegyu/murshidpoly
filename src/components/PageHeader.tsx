import { ReactNode, memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

const PageHeader = memo(({ title, subtitle, icon, actions, className }: PageHeaderProps) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{ willChange: "transform, opacity" }}
      className={cn("relative flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4 mb-3 md:mb-4 pb-2 md:pb-3 border-b border-border/60", className)}
    >
      <div className="flex items-start gap-2.5 md:gap-3.5">
        {icon && (
          <div className="h-7 w-7 md:h-10 md:w-10 rounded-lg md:rounded-xl bg-gradient-to-br from-primary to-primary/80 grid place-items-center shadow-elegant shrink-0 border border-white/10 ring-2 md:ring-4 ring-primary/5">
            <div className="text-accent scale-[0.55] md:scale-[0.75]">{icon}</div>
          </div>
        )}
        <div className="space-y-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <img 
              src="/rs.png" 
              alt="BAU" 
              loading="lazy"
              decoding="async"
              className="h-3 w-3 object-contain opacity-80"
            />
            <span className="text-[7.5px] font-black tracking-[0.2em] uppercase text-accent">BAU Engineering Hub</span>
          </div>
          <h1 className="text-lg md:text-xl lg:text-2xl font-black tracking-tight text-foreground drop-shadow-sm">{title}</h1>
          {subtitle && <p className="text-[10px] md:text-xs text-muted-foreground mt-0 md:mt-1 max-w-2xl font-bold leading-tight">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-1.5 md:gap-2.5 pt-1 md:pt-0">{actions}</div>}
    </motion.header>
  );
});

PageHeader.displayName = "PageHeader";

export default PageHeader;
