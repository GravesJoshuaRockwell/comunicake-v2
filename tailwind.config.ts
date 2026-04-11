import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "#f7f8fc",
        surface: "#ffffff",
        "surface-hover": "#f1f3fa",
        border: "#e2e6f0",
        "border-hover": "#c8cfe8",
        "text-primary": "#0f1322",
        "text-secondary": "#4b5473",
        "text-muted": "#8b93b8",
        primary: "#7c3aed",
        "primary-dim": "#6d28d9",
        blue: "#3b82f6",
        green: "#10b981",
        red: "#ef4444",
        orange: "#f97316",
        yellow: "#f59e0b",
        purple: "#7c3aed",
        gold: "#7c3aed",
      },
    },
  },
  plugins: [],
};
export default config;
