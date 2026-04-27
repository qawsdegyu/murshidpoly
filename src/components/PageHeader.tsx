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
      className={cn("relative flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10 pb-8 border-b border-border/60", className)}
    >
      <div className="flex items-start gap-5">
        {icon && (
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 grid place-items-center shadow-elegant shrink-0 border border-white/10 ring-4 ring-primary/5">
            <div className="text-accent">{icon}</div>
          </div>
        )}
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <img 
              src="https://upload.wikimedia.org/wikipedia/en/2/2d/Al-Balqa_Applied_University_logo.png" 
              alt="BAU" 
              className="h-5 w-5 object-contain opacity-80"
            />
            <span className="text-[10px] font-black tracking-[0.2em] uppercase text-accent">BAU Engineering Hub</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-slate-100 drop-shadow-sm">{title}</h1>
          {subtitle && <p className="text-slate-600 dark:text-slate-400 mt-2 max-w-2xl font-medium leading-relaxed">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-3 pt-4 md:pt-0">{actions}</div>}
    </motion.header>
  );
}
