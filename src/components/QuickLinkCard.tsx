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
        <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-20 lg:h-20 rounded-full bg-slate-100/60 dark:bg-slate-800/60 flex items-center justify-center transition-all duration-300 group-hover:bg-slate-200/80 dark:group-hover:bg-slate-700/80 shadow-sm border border-slate-200 dark:border-white/5 isolation-isolate">
          <Icon className="w-5 h-5 lg:w-10 lg:h-10 text-content transition-transform duration-300 group-hover:scale-110 pointer-events-none" strokeWidth={1.5} />
        </div>
        {/* Label */}
        <span className="text-[10px] font-bold mt-1 text-content lg:text-sm lg:font-black lg:mt-2.5 text-center leading-tight max-w-[70px] sm:max-w-[80px] lg:max-w-[110px] line-clamp-2 break-words pointer-events-none">
          {label}
        </span>
      </Link>
    </m.div>
  );
}
