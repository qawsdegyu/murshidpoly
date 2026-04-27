import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export default function PageHeader({ title, subtitle, icon, actions, className }: PageHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("relative flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-6 mb-6 md:mb-10 pb-4 md:pb-8 border-b border-border/60", className)}
    >
      <div className="flex items-start gap-3 md:gap-5">
        {icon && (
          <div className="h-9 w-9 md:h-14 md:w-14 rounded-lg md:rounded-2xl bg-gradient-to-br from-primary to-primary/80 grid place-items-center shadow-elegant shrink-0 border border-white/10 ring-2 md:ring-4 ring-primary/5">
            <div className="text-accent scale-[0.65] md:scale-100">{icon}</div>
          </div>
        )}
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 mb-0.5">
            <img 
              src="https://upload.wikimedia.org/wikipedia/en/2/2d/Al-Balqa_Applied_University_logo.png" 
              alt="BAU" 
              className="h-4 w-4 object-contain opacity-80"
            />
            <span className="text-[9px] font-black tracking-[0.2em] uppercase text-accent">BAU Engineering Hub</span>
          </div>
          <h1 className="text-lg md:text-2xl lg:text-3xl font-black tracking-tight text-foreground drop-shadow-sm">{title}</h1>
          {subtitle && <p className="text-[11px] md:text-sm text-muted-foreground mt-0.5 md:mt-2 max-w-2xl font-medium leading-relaxed">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2 md:gap-3 pt-2 md:pt-0">{actions}</div>}
    </motion.header>
  );
}
