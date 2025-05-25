// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        radiant: {
          base: "#1F1B2E",
          flame: "#FF6B6B",
          glow: "#A78BFA",
          pulse: "#00FFD1",
        },
      },
      boxShadow: {
        'inner-glow': 'inset 0 0 10px rgba(167, 139, 250, 0.4)',
        'outer-glow': '0 0 20px rgba(0, 255, 209, 0.6)',
      },
      animation: {
        pulseGlow: "pulseGlow 2s ease-in-out infinite",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 10px rgba(0, 255, 209, 0.4)" },
          "50%": { boxShadow: "0 0 20px rgba(0, 255, 209, 0.8)" },
        },
      },
      fontFamily: {
        radiant: ["'Segoe UI'", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
