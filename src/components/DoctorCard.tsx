import { memo } from "react";
import { motion } from "framer-motion";
import { MoreHorizontal, GraduationCap, MapPin } from "lucide-react";
import { type FacultyMember } from "@/data/facultyData";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface DoctorCardProps {
  faculty: FacultyMember;
  index: number;
  lang: string;
  isExpanded: boolean;
  onToggle: (id: string) => void;
  onCopy: (email: string) => void;
}

const DoctorCard = memo(function DoctorCard({ faculty: f, index: i, lang, isExpanded, onToggle, onCopy }: DoctorCardProps) {
  const navigate = useNavigate();

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      className={cn(
        "group cursor-pointer bg-[#F8FAFC] dark:bg-[#1E293B] border-[#E2E8F0] dark:border-[#334155] border rounded-2xl transition-all duration-500 overflow-hidden shadow-sm",
        isExpanded ? "border-[#5EEAD4] dark:border-[#14B8A6] shadow-md" : "hover:shadow-md hover:border-[#CBD5E1] dark:hover:border-[#64748B]"
      )}
      onClick={() => onToggle(f.id)}
    >
      {/* MOBILE LAYOUT: Horizontal Compact Rectangle */}
      <div className="md:hidden flex w-full min-h-[65px] items-center relative overflow-hidden">

        {/* Right Side: Content Area */}
        <div className="flex-1 h-full p-2.5 sm:p-3 flex flex-col justify-center gap-1.5 text-start min-w-0 bg-[#F8FAFC] dark:bg-[#1E293B]">
          <div className="space-y-0.5">
            <h3 className="text-sm font-black text-[#0F172A] dark:text-[#F8FAFC] leading-tight line-clamp-1 transition-colors">
              {f.name.startsWith("د.") ? f.name : `د. ${f.name}`}
            </h3>
            <p className="text-[10px] text-[#14B8A6] font-bold truncate flex items-center gap-1">
              <GraduationCap className="h-3 w-3 text-[#14B8A6] shrink-0" />
              <span>{f.department}</span>
            </p>
          </div>

          <div className="flex items-center justify-between gap-2 mt-1">
            <div className="flex flex-wrap gap-1">
              {f.rank && (
                <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-[#F1F5F9] dark:bg-[#0F172A] text-[#64748B] dark:text-[#94A3B8] border border-[#E2E8F0] dark:border-[#334155] uppercase tracking-wider">
                  {f.rank}
                </span>
              )}
              
              {f.buildingId && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/campus-map?id=${f.buildingId}`);
                  }}
                  className="flex items-center gap-0.5 text-[8px] font-black px-1.5 py-0.5 rounded bg-[#E8FCF9] dark:bg-[#0F172A] text-[#14B8A6] dark:text-[#14B8A6] hover:bg-[#5EEAD4]/20 dark:hover:bg-[#14B8A6]/20 transition-all uppercase tracking-wider"
                >
                  <MapPin className="h-2.5 w-2.5" />
                  <span>{lang === "ar" ? `مبنى ${f.buildingId}` : `Bldg ${f.buildingId}`}</span>
                </button>
              )}
            </div>

            <div className="w-7 h-7 rounded-lg bg-[#F1F5F9] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] flex items-center justify-center text-[#64748B] dark:text-[#94A3B8] transition-all group-hover:bg-[#E2E8F0] dark:group-hover:bg-[#1E293B] group-hover:text-[#0F172A] dark:group-hover:text-[#F8FAFC]">
              <MoreHorizontal className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP LAYOUT: Premium Bento style Card */}
      <div className="hidden md:block p-6 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#E8FCF9] rounded-full blur-2xl group-hover:bg-[#5EEAD4]/20 transition-all" />

        <div className="flex items-center gap-5 relative z-10">

          
          <div className="min-w-0 flex-1">
            <h3 className="font-black text-xl text-[#0F172A] dark:text-[#F8FAFC] transition-colors leading-tight">
              {f.name.startsWith("د.") ? f.name : `د. ${f.name}`}
            </h3>
            
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-2">
              {f.rank && (
                <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-[#F1F5F9] dark:bg-[#0F172A] text-[#64748B] dark:text-[#94A3B8] border border-[#E2E8F0] dark:border-[#334155] uppercase tracking-wider">
                  {f.rank}
                </span>
              )}
              
              {f.buildingId && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/campus-map?id=${f.buildingId}`);
                  }}
                  className="flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-md bg-[#E8FCF9] dark:bg-[#0F172A] text-[#14B8A6] dark:text-[#14B8A6] hover:bg-[#5EEAD4]/20 dark:hover:bg-[#14B8A6]/20 transition-all uppercase tracking-wider"
                >
                  <MapPin className="h-3 w-3" />
                  {lang === "ar" ? `مبنى ${f.buildingId}` : `Bldg ${f.buildingId}`}
                </button>
              )}
            </div>
          </div>

          <div className="w-10 h-10 rounded-xl bg-[#F1F5F9] dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#334155] flex items-center justify-center text-[#64748B] dark:text-[#94A3B8] transition-all group-hover:bg-[#E2E8F0] dark:group-hover:bg-[#1E293B] group-hover:text-[#0F172A] dark:group-hover:text-[#F8FAFC]">
             <MoreHorizontal className="w-6 h-6" />
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-[#F1F5F9] dark:border-[#334155] flex items-center gap-3 relative z-10">
          <GraduationCap className="h-4 w-4 text-[#14B8A6]" />
          <p className="text-sm text-[#14B8A6] font-bold truncate">
            {f.department}
          </p>
        </div>
      </div>
    </motion.article>
  );
});

export default DoctorCard;
