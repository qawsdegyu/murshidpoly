import { motion } from "framer-motion";
import { usePreferences } from "@/contexts/PreferencesContext";
import { Users, GraduationCap, Code2, Database, Palette } from "lucide-react";
import { announcements } from "@/data/announcements";

const FoundingTeamAnnouncement = () => {
  const { lang, dir } = usePreferences();
  const isAr = lang === "ar";

  // Link dynamically to the single announcement object
  const launchAnn = announcements.find(a => a.id === "official-launch-v1") || announcements[0];
  const founders = launchAnn.founders || [];

  const getIcon = (role: string) => {
    if (role.includes("CTO")) return <Code2 className="w-5 h-5 text-cyan-400" />;
    if (role.includes("Data") || role.includes("Relations")) return <Database className="w-5 h-5 text-cyan-400" />;
    return <Palette className="w-5 h-5 text-cyan-400" />;
  };

  return (
    <section className="w-full bg-slate-950 pt-0 pb-0 overflow-hidden border-t border-cyan-500/20">
      <div className="max-w-[1440px] mx-auto flex justify-center pt-8 pb-10 md:pt-12 md:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-[95%] md:w-[80%] relative group"
        >
          {/* Glowing Border Wrapper - thickness adjusts based on screen size as requested */}
          <div className="absolute -inset-[1px] md:-inset-[2px] bg-gradient-to-r from-cyan-500/40 via-cyan-400 to-cyan-500/40 rounded-[2rem] md:rounded-[2.5rem] blur-[2px] opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Main Card - Dark Glassmorphism */}
          <div className="relative flex flex-col md:flex-row bg-[#0a192f]/90 backdrop-blur-2xl rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border border-cyan-500/20 shadow-2xl">
            
            {/* Team Image Section - Vertical on mobile, Horizontal on desktop */}
            <div className="w-full md:w-[42%] h-56 sm:h-64 md:h-auto relative overflow-hidden shrink-0">
              <img 
                src="/rs.png.png" 
                alt="The Founding Team" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              />
              {/* Gradient overlay for better text contrast and blending */}
              <div className={`absolute inset-0 bg-gradient-to-t md:bg-gradient-to-${dir === 'rtl' ? 'left' : 'right'} from-[#0a192f] via-[#0a192f]/40 to-transparent`} />
              
              {/* Floating Badge */}
              <div className={`absolute top-4 ${dir === 'rtl' ? 'right-4' : 'left-4'} md:top-6 md:${dir === 'rtl' ? 'right-6' : 'left-6'}`}>
                <div className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-cyan-500/20 backdrop-blur-md border border-cyan-500/40 shadow-lg">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-cyan-400 text-[9px] md:text-xs font-black uppercase tracking-widest font-['Cairo']">
                    {isAr ? launchAnn.badgeAr : launchAnn.badge}
                  </span>
                </div>
              </div>
            </div>

            {/* Text Content Section */}
            <div className={`flex-1 p-6 sm:p-8 md:p-12 lg:p-14 flex flex-col justify-center ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
              <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                <Users className="text-cyan-400 h-5 w-5 md:h-8 md:w-8" />
                <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-black text-foreground font-['Cairo'] tracking-tight leading-tight">
                  {isAr ? "تحية من الفريق المؤسس" : "Greetings from the Founders"}
                </h2>
              </div>
              
              {/* Scale font size on mobile as requested */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 md:px-3 md:py-1.5 rounded-lg md:rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[10px] md:text-sm font-bold font-['Cairo'] mb-6 md:mb-8 w-fit">
                <GraduationCap className="h-3 w-3 md:h-4 md:w-4" />
                {isAr ? "طالب هندسة - السنة الثانية (دفعة 2028)" : "2nd-year Engineering Students at BAU (Class of 2028)"}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:gap-5 md:gap-7">
                {founders.map((founder, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: dir === 'rtl' ? 20 : -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * idx, duration: 0.5 }}
                    className="flex items-start gap-3 md:gap-4 group/member"
                  >
                    <div className="h-10 w-10 md:h-14 md:w-14 rounded-xl md:rounded-2xl border border-cyan-500/20 overflow-hidden shrink-0 group-hover/member:border-cyan-400 transition-all duration-300 transform group-hover/member:scale-110 shadow-[0_0_15px_rgba(0,255,255,0.1)]">
                      <img src={founder.image} alt={founder.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg md:text-2xl font-black text-foreground group-hover/member:text-cyan-400 transition-colors leading-tight mb-1 font-['Cairo']">
                        {isAr ? founder.nameAr : founder.name}
                      </h3>
                      <p className="text-[10px] sm:text-xs md:text-base text-slate-400 font-bold font-['Cairo'] opacity-80">
                        {isAr ? founder.roleAr : founder.role}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Decorative Internal Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[100px] pointer-events-none" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FoundingTeamAnnouncement;
