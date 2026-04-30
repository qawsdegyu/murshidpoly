import { m } from "framer-motion";
import { Link } from "react-router-dom";
import { ComponentType, SVGProps } from "react";
import { prefetchPage } from "@/lib/prefetch";

type QuickLinkProps = {
  to: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  prefetch?: () => Promise<any>;
};

export default function QuickLinkCard({ to, icon: Icon, label, prefetch }: QuickLinkProps) {
  return (
    <m.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.95 }}
      className="flex flex-col items-center"
    >
      <Link 
        to={to} 
        onMouseEnter={() => prefetch && prefetchPage(prefetch)}
        className="group flex flex-col items-center"
      >
        {/* Circle container */}
        <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-24 lg:h-24 rounded-full bg-surface/80 flex items-center justify-center transition-all duration-300 group-hover:bg-accent group-hover:text-accent-foreground group-hover:shadow-[0_0_25px_hsl(var(--accent)/0.6)] border border-border shadow-sm isolation-isolate group-active:scale-90">
          <Icon className="w-7 h-7 lg:w-11 lg:h-11 text-foreground transition-transform duration-300 group-hover:scale-110 pointer-events-none" strokeWidth={2} />
        </div>
        {/* Label */}
        <span className="text-[10px] font-bold mt-1 text-content lg:text-sm lg:font-black lg:mt-2.5 text-center leading-tight max-w-[70px] sm:max-w-[80px] lg:max-w-[110px] line-clamp-2 break-words pointer-events-none">
          {label}
        </span>
      </Link>
    </m.div>
  );
}
