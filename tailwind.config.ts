import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: { center: true, padding: "1rem", screens: { "2xl": "1200px" } },
    extend: {
      fontFamily: {
        display: ["Outfit", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        felt: { DEFAULT: "#0d5c3f", dark: "#08402b", light: "#1f8a5f" },
        rail: "#5b3a24",
        tier1: "#16a34a",
        tier2: "#ea580c",
        tier3: "#7c3aed",
      },
      borderRadius: { lg: "var(--radius)", md: "calc(var(--radius) - 2px)", sm: "calc(var(--radius) - 4px)" },
      keyframes: {
        "card-in": { from: { opacity: "0", transform: "translateY(16px) rotate(-2deg) scale(.96)" }, to: { opacity: "1", transform: "none" } },
        pop: { "0%": { transform: "scale(1)" }, "50%": { transform: "scale(1.15)" }, "100%": { transform: "scale(1)" } },
      },
      animation: { "card-in": "card-in .35s ease-out", pop: "pop .4s ease-out" },
    },
  },
  plugins: [animate],
} satisfies Config;
