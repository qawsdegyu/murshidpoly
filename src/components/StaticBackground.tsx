import { memo } from "react";

const StaticBackground = memo(() => {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10 bg-background">
      {/* ── Ultra-Performance Static Background System ── */}
      
      {/* Dynamic Gradient from CoursePage - Moved here to be stable */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(59,130,246,0.05)_0%,transparent_70%)]" />

      {/* Subtle Static Glows - Enabled only for Desktop */}
      <div
        style={{ willChange: "transform", background: "radial-gradient(circle, hsl(var(--accent)/0.08) 0%, transparent 70%)" }}
        className="absolute -top-40 -right-40 h-[45rem] w-[45rem] rounded-full hidden md:block"
      />
      <div
        style={{ willChange: "transform", background: "radial-gradient(circle, hsl(var(--primary)/0.1) 0%, transparent 70%)" }}
        className="absolute -bottom-60 -left-40 h-[50rem] w-[50rem] rounded-full hidden md:block"
      />

      {/* Glassmorphic Accents - Optimized */}
      <div className="absolute top-[15%] right-[10%] w-32 h-32 rounded-3xl bg-white/[0.02] border border-white/5 hidden lg:block" />
      <div className="absolute bottom-[20%] left-[15%] w-48 h-48 rounded-full bg-accent/[0.01] border border-accent/5 hidden lg:block" />

      {/* Optimized Grain Texture */}
      <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.1] mix-blend-overlay pointer-events-none bg-[url('/noise.svg')] bg-repeat" />
    </div>
  );
});

StaticBackground.displayName = "StaticBackground";

export default StaticBackground;
