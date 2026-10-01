/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        amberDark: "#1C1008",
        amberDeep: "#120904",
        amberGlow: "#2A160A",
        terracotta: "#8C4024",
        terracottaLight: "#B35433",
        bambooToast: "#A06B33",
        bambooWarm: "#C29B38",
        stellarGold: "#D4AF37",
        goldBright: "#F5D77F"
      },
      fontFamily: {
        sacred: ["'Cinzel'", "serif"],
        editorial: ["'Cormorant Garamond'", "Georgia", "serif"],
        sans: ["'Plus Jakarta Sans'", "sans-serif"]
      }
    }
  },
  plugins: []
};
