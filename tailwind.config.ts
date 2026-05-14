import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#d4af37",
        secondary: "#1a1a1a",
        accent: "#ff3333",
      },
      fontFamily: {
        display: ["Arial", "sans-serif"],
        mono: ["Courier New", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
