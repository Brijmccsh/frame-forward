import type { Config } from "tailwindcss";

/**
 * Theme colors are driven by CSS variables declared in app/globals.css as
 * space-separated RGB channels, so Tailwind's opacity modifiers work
 * (e.g. `bg-primary/10`, `text-muted/70`).
 */
const themeColor = (variable: string) => `rgb(var(${variable}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Static brand palette
        brand: {
          navy: "#2B2D33",
          pink: "#DB8596",
          teal: "#6F9D9B",
          lpink: "#DCB0B9",
          lteal: "#BDD4D3",
        },
        // Themed tokens (light / dark)
        bg: themeColor("--bg"),
        surface: themeColor("--surface"),
        "surface-2": themeColor("--surface-2"),
        text: themeColor("--text"),
        muted: themeColor("--muted"),
        border: themeColor("--border"),
        primary: {
          DEFAULT: themeColor("--primary"),
          fg: themeColor("--primary-fg"),
          // Use `ink` whenever the colour is text on a neutral background.
          ink: themeColor("--primary-ink"),
        },
        accent: {
          DEFAULT: themeColor("--accent"),
          fg: themeColor("--accent-fg"),
          ink: themeColor("--accent-ink"),
        },
        ring: themeColor("--ring"),
        danger: {
          DEFAULT: themeColor("--danger"),
          fg: themeColor("--danger-fg"),
        },
      },
      borderColor: {
        DEFAULT: themeColor("--border"),
      },
      fontFamily: {
        head: ["var(--font-head)", "Georgia", "serif"],
        body: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "10px",
        md: "14px",
        lg: "18px",
        xl: "24px",
        pill: "999px",
      },
      boxShadow: {
        xs: "0 1px 2px rgb(43 45 51 / 0.04)",
        sm: "0 1px 3px rgb(43 45 51 / 0.06), 0 1px 2px rgb(43 45 51 / 0.04)",
        md: "0 6px 18px -6px rgb(43 45 51 / 0.10), 0 2px 6px -2px rgb(43 45 51 / 0.06)",
        lg: "0 18px 40px -12px rgb(43 45 51 / 0.16), 0 6px 14px -8px rgb(43 45 51 / 0.08)",
        xl: "0 32px 64px -20px rgb(43 45 51 / 0.22), 0 10px 24px -12px rgb(43 45 51 / 0.10)",
        glow: "0 10px 30px -10px rgb(219 133 150 / 0.45)",
        none: "none",
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem" }],
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
      },
      maxWidth: {
        prose: "68ch",
      },
      transitionTimingFunction: {
        soft: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "translateY(6px) scale(0.98)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "toast-in": {
          from: { opacity: "0", transform: "translateY(12px) scale(0.98)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out both",
        "fade-up": "fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) both",
        "scale-in": "scale-in 0.18s cubic-bezier(0.22, 1, 0.36, 1) both",
        "toast-in": "toast-in 0.24s cubic-bezier(0.22, 1, 0.36, 1) both",
        shimmer: "shimmer 1.8s infinite",
        float: "float 8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
