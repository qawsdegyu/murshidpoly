import { motion } from "framer-motion";
import { usePreferences } from "@/contexts/PreferencesContext";
import { Megaphone, ExternalLink, Sparkles } from "lucide-react";

interface AdSpaceProps {
  isAdmin?: boolean;
}

const AdSpace = ({ isAdmin }: AdSpaceProps) => {
  const { lang, dir } = usePreferences();
  const isAr = lang === "ar";

  return (
    <section className="w-full bg-slate-950 pt-0 pb-10 overflow-hidden border-t border-cyan-500/20">
      <div className="max-w-[1440px] mx-auto flex justify-center pt-8 md:pt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-[95%] md:w-[85%] relative group cursor-pointer"
        >
          {/* Animated Glowing Border */}
          <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500/20 via-cyan-400/40 to-cyan-500/20 rounded-2xl md:rounded-3xl blur-[2px] opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Main Card */}
          <div className="relative h-40 md:h-48 bg-[#0a192f]/60 backdrop-blur-3xl rounded-2xl md:rounded-3xl overflow-hidden border border-cyan-500/10 shadow-2xl flex items-center justify-center">
            
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #00ffff 1px, transparent 0)', backgroundSize: '24px 24px' }} />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center text-center px-6">
              <div className="mb-4 p-3 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all duration-300">
                <Megaphone className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              
              <h3 className="text-xl md:text-3xl font-black text-white font-['Cairo'] tracking-tight mb-2 flex items-center gap-3">
                {isAr ? "مساحة إعلانية مخصصة" : "Premium Ad Space"}
                <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
              </h3>
              
              <p className="text-cyan-400/70 text-xs md:text-sm font-bold font-['Cairo'] uppercase tracking-widest flex items-center gap-2">
                {isAdmin 
                  ? (isAr ? "إدارة المساحات الإعلانية" : "Manage Advertisement Slots")
                  : (isAr ? "فرصتك للوصول لمهندسي المستقبل" : "Reach the engineers of tomorrow")
                }
                <ExternalLink className="w-3 h-3" />
              </p>
            </div>

            {/* Decorative Corner Accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-500/30 rounded-tl-2xl" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-500/30 rounded-br-2xl" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AdSpace;
