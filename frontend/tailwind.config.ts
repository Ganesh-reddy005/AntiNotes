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
        mistral: {
          bg: "#fcfbf9", // The "Rich Cream" background
          navy: "#0f172a", // Deep ink black
          orange: "#f97316", // The "Sunset" accent
          yellow: "#fef08a", // Pale yellow highlight
          sand: "#e5e5e5",
        }
      },
      fontFamily: {
        serif: ["var(--font-serif)", "serif"], // Playfair Display
        sans: ["var(--font-sans)", "sans-serif"], // Inter
        mono: ["var(--font-mono)", "monospace"], // JetBrains Mono
      },
      backgroundImage: {
        'pixel-pattern': "url(\"data:image/svg+xml,%3Csvg width='8' height='8' viewBox='0 0 8 8' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h1v1H0z' fill='%230f172a' fill-opacity='0.05'/%3E%3C/svg%3E\")",
      }
    },
  },
  plugins: [],
};
export default config;