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
      <div className="flex flex-col md:flex-row md:items-end justify-between w-full gap-4">
        <div className="flex items-start gap-4 md:gap-6">
          {icon && (
            <div className="h-10 w-10 md:h-14 md:w-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 grid place-items-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] shrink-0 border border-white/10 ring-4 ring-primary/5">
              <div className="text-accent scale-[0.7] md:scale-100">{icon}</div>
            </div>
          )}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="h-1 w-4 rounded-full bg-accent/40" />
              <span className="text-[8px] md:text-[10px] font-black tracking-[0.3em] uppercase text-accent/80 font-mono">BAU Engineering Hub</span>
            </div>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-black tracking-tight text-foreground drop-shadow-sm font-['Cairo'] leading-[1.2]">
              {title}
            </h1>
            {subtitle && (
              <p className="text-[11px] md:text-sm text-muted-foreground mt-4 md:mt-6 max-w-2xl font-bold leading-relaxed opacity-80">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {actions && (
          <div className="flex items-center gap-2 md:gap-3 self-end md:self-center">
            {actions}
          </div>
        )}
      </div>
    </motion.header>
  );
});

PageHeader.displayName = "PageHeader";

export default PageHeader;
