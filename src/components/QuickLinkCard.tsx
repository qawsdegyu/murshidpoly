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
      whileHover={{ y: -6, scale: 1.04 }}
      whileTap={{ scale: 0.93 }}
      className="flex flex-col items-center"
    >
      <Link
        to={to}
        onMouseEnter={() => prefetch && prefetchPage(prefetch)}
        className="group flex flex-col items-center gap-2 md:gap-3"
      >
        {/* Circle container */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full bg-surface/80 flex items-center justify-center transition-all duration-500 group-hover:bg-accent group-hover:text-accent-foreground group-hover:shadow-[0_0_30px_hsl(var(--accent)/0.35)] border-2 border-border/50 shadow-md isolation-isolate group-active:scale-90">
          <Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-9 md:h-9 lg:w-11 lg:h-11 text-foreground transition-transform duration-500 group-hover:scale-110 pointer-events-none" strokeWidth={1.5} />
        </div>
        {/* Label */}
        <span className="text-[10px] sm:text-xs md:text-sm lg:text-base font-black text-content text-center leading-tight max-w-[72px] sm:max-w-[80px] md:max-w-[120px] line-clamp-2 break-words pointer-events-none transition-colors group-hover:text-accent">
          {label}
        </span>
      </Link>
    </m.div>
  );
}
