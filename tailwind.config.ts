import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input, var(--border)))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        // ── BAU Brand Scale (Colors from Palette) ───────────────
        blue: {
          primary: "#2563EB",
          dark: "#0F172A",
        },
        teal: {
          secondary: "#14B8A6",
          light: "#5EEAD4",
        },
        gray: {
          bg: "#F8FAFC",
          light: "#F1F5F9",
          calm: "#E2E8F0",
          medium: "#CBD5E1",
          support: "#64748B",
          surface: "#1E293B",
        },
        orange: {
          warning: "#F59E0B",
        },

        // ── Semantic Tokens ──────────────────────────────────
        surface: "hsl(var(--surface))",

        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive, 0 84% 60%))",
          foreground: "hsl(var(--destructive-foreground, 0 0% 100%))",
        },
        success: {
          DEFAULT: "hsl(var(--success, 142 71% 45%))",
          foreground: "hsl(var(--success-foreground, 0 0% 100%))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--foreground))",
          primary: "hsl(var(--primary))",
          "primary-foreground": "hsl(var(--primary-foreground))",
          accent: "hsl(var(--accent))",
          "accent-foreground": "hsl(var(--accent-foreground))",
          border: "hsl(var(--border))",
          ring: "hsl(var(--ring))",
        },
      },
      fontSize: {
        'hero': ['clamp(2.2rem, 6vw, 4.5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'section-title': ['clamp(1.5rem, 4vw, 2.5rem)', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'card-title': ['clamp(1.05rem, 2.2vw, 1.45rem)', { lineHeight: '1.3' }],
        'body-text': ['clamp(0.85rem, 1.5vw, 1rem)', { lineHeight: '1.5' }],
      },
      borderRadius: {
        // Brand guide: 8px buttons, 12px cards, 16px sections, 100px pills
        lg: "var(--radius)",         // 12px — cards
        md: "8px",                   // 8px  — buttons & inputs
        sm: "6px",                   // 6px  — small elements
        section: "16px",             // 16px — section containers
        pill: "100px",               // 100px — badges & tags
      },
      backgroundImage: {
        "gradient-primary": "var(--gradient-primary)",
        "gradient-gold": "var(--gradient-gold)",
        "gradient-hero": "var(--gradient-hero)",
      },
      boxShadow: {
        elegant: "var(--shadow-elegant)",
        gold: "var(--shadow-gold)",
      },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        "fade-in": { "0%": { opacity: "0", transform: "translateY(8px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        "scale-in": { "0%": { opacity: "0", transform: "scale(0.96)" }, "100%": { opacity: "1", transform: "scale(1)" } },
        "pulse-pink": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(230,62,109,0.5), 0 0 20px rgba(230,62,109,0.3)" },
          "50%":      { boxShadow: "0 0 0 12px rgba(230,62,109,0), 0 0 36px rgba(230,62,109,0.6)" },
        },
        "pulse-gold": {
          "0%, 100%": { boxShadow: "0 0 0 0 hsl(var(--accent) / 0.6), 0 0 24px hsl(var(--accent) / 0.4)" },
          "50%": { boxShadow: "0 0 0 14px hsl(var(--accent) / 0), 0 0 40px hsl(var(--accent) / 0.7)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.4s ease-out",
        "scale-in": "scale-in 0.25s ease-out",
        "pulse-pink": "pulse-pink 2.4s ease-in-out infinite",
        "pulse-gold": "pulse-gold 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
