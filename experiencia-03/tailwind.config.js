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
        cyanCymatic: "#38BDF8",
        indigoDeep: "#1E1B4B"
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
