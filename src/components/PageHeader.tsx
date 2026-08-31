import { ReactNode, memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  className?: string;
  compact?: boolean;
}

const PageHeader = memo(({ actions, className }: PageHeaderProps) => {
  if (!actions) return null;
  
  return (
    <div className={cn("flex justify-end w-full mb-6", className)}>
      <div className="flex items-center gap-2 md:gap-3">
        {actions}
      </div>
    </div>
  );
});

PageHeader.displayName = "PageHeader";

export default PageHeader;
