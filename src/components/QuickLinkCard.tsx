import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ComponentType, SVGProps } from "react";

type QuickLinkProps = {
  to: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
};

export default function QuickLinkCard({ to, icon: Icon, label }: QuickLinkProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex flex-col items-center"
    >
      <Link to={to} className="group flex flex-col items-center">
        {/* Circle container */}
        <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-20 lg:h-20 rounded-full bg-slate-100/60 dark:bg-slate-800/60 flex items-center justify-center transition-all duration-300 group-hover:bg-slate-200/80 dark:group-hover:bg-slate-700/80 shadow-sm border border-slate-200 dark:border-white/5">
          <Icon className="w-5 h-5 lg:w-10 lg:h-10 text-content transition-transform duration-300 group-hover:scale-110" strokeWidth={1.5} />
        </div>
        {/* Label */}
        <span className="text-[10px] font-bold mt-1 text-content lg:text-sm lg:font-black lg:mt-2.5 text-center leading-tight max-w-[70px] sm:max-w-[80px] lg:max-w-[110px] line-clamp-2 break-words">
          {label}
        </span>
      </Link>
    </motion.div>
  );
}
