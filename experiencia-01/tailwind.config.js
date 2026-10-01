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
        obsidian: "#090A10",
        voidSurface: "#131422",
        stellarGold: "#D4AF37",
        goldBright: "#F5D77F",
        violetBtnStart: "#5B2B85",
        violetBtnEnd: "#361456",
        lavenderSoft: "#DDD6FE",
        lavenderEthereal: "#C4B5FD"
      },
      fontFamily: {
        celestial: ["'Pinyon Script'", "cursive"],
        editorial: ["'Cormorant Garamond'", "Georgia", "serif"],
        sacred: ["'Cinzel'", "serif"],
        sans: ["'Plus Jakarta Sans'", "sans-serif"]
      }
    }
  },
  plugins: []
};
