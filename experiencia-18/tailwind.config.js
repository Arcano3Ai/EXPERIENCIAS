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
        bronzeAncient: "#996515",
        bronzeWarm: "#CD7F32",
        brassBell: "#D4AF37",
        goldTemple: "#F5D77F",
        monkSaffron: "#9E2A2B",
        templeDark: "#0F0A05",
        templeSurface: "#1C140B"
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
