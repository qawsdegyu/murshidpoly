import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { SkipForward } from "lucide-react";
import { usePreferences } from "@/contexts/PreferencesContext";

interface IntroProps {
  onFinish: () => void;
}

export default function Intro({ onFinish }: IntroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { lang, dir } = usePreferences();

  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] overflow-hidden"
      style={{ backgroundColor: "hsl(222 47% 4%)" }}
      dir={dir}
    >
      {/* Subtle ambient gold glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--accent)/0.12)_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.25)_0%,transparent_55%)]" />

      {/* Hidden background video — kept for optional cinematic footage */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover opacity-20"
      >
        <source src="/intro.mp4" type="video/mp4" />
      </video>

      {/* Centered logo / brand */}
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          className="flex flex-col items-center gap-5"
        >
          <div className="relative">
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full bg-accent/40 blur-3xl"
            />
            <motion.div
              animate={{ boxShadow: [
                "0 0 0 0 hsl(46 65% 52% / 0.6), 0 0 60px hsl(46 65% 52% / 0.4)",
                "0 0 0 22px hsl(46 65% 52% / 0), 0 0 90px hsl(46 65% 52% / 0.7)",
                "0 0 0 0 hsl(46 65% 52% / 0), 0 0 60px hsl(46 65% 52% / 0.4)",
              ]}}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              className="relative h-28 w-28 md:h-36 md:w-36 rounded-full grid place-items-center bg-gradient-to-br from-primary via-primary/80 to-primary/60 ring-2 ring-accent/60"
            >
              <span
                className="text-5xl md:text-6xl font-extrabold text-accent drop-shadow-[0_2px_12px_hsl(var(--accent)/0.7)]"
                style={{ fontFamily: "Cairo, sans-serif" }}
              >
                {lang === "ar" ? "م" : "M"}
              </span>
            </motion.div>
          </div>

          <h1
            className="font-bold tracking-tight text-5xl md:text-7xl bg-gradient-to-b from-accent via-accent to-accent/70 bg-clip-text text-transparent"
            style={{ fontFamily: "Cairo, sans-serif" }}
          >
            {lang === "ar" ? "مُرشد البوليتكنك" : "Murshid Polytechnic"}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 1.1 }}
            className="text-xs md:text-sm font-medium tracking-[0.3em] uppercase text-foreground/70"
            style={{ fontFamily: "Cairo, sans-serif" }}
          >
            {lang === "ar" ? "كلية الهندسة التكنولوجية – ماركا" : "Faculty of Engineering Technology — Marka"}
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.4, ease: "easeOut", delay: 1.3 }}
            className="h-[2px] w-32 bg-gradient-to-r from-transparent via-accent to-transparent origin-center"
          />
        </motion.div>
      </div>

      {/* Skip button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.5 }}
        onClick={onFinish}
        className="absolute bottom-6 end-6 z-20 group flex items-center gap-2 rounded-full border border-accent/40 bg-background/40 px-4 py-2 text-sm font-semibold text-foreground backdrop-blur-md hover:border-accent hover:bg-background/60 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        style={{ fontFamily: "Cairo, sans-serif" }}
        aria-label={lang === "ar" ? "تخطي" : "Skip"}
      >
        <span>{lang === "ar" ? "تخطي" : "Skip"}</span>
        <SkipForward className={`h-4 w-4 ${dir === "rtl" ? "rotate-180" : ""} group-hover:text-accent`} />
      </motion.button>

      {/* Bottom cinematic loading bar */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 5, ease: "linear" }}
        className="absolute bottom-0 left-0 right-0 z-10 h-[2px] bg-gradient-to-r from-accent/0 via-accent to-accent/0 origin-left"
      />
    </motion.div>
  );
}
