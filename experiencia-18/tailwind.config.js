/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "../experiencia-01/*.{js,ts,jsx,tsx,html}",
    "../experiencia-02/*.{js,ts,jsx,tsx,html}",
    "../experiencia-03/*.{js,ts,jsx,tsx,html}",
    "../experiencia-18/*.{js,ts,jsx,tsx,html}",
    "../experiencia-19/*.{js,ts,jsx,tsx,html}",
    "../experiencia-20/*.{js,ts,jsx,tsx,html}"
  ],
  theme: {
    extend: {
      colors: {
        // Cuencos & Templo
        bronzeAncient: "#996515",
        bronzeWarm: "#CD7F32",
        brassBell: "#D4AF37",
        goldTemple: "#F5D77F",
        monkSaffron: "#9E2A2B",
        templeDark: "#0F0A05",
        templeSurface: "#1C140B",
        // Arcángeles & Mística
        obsidian: "#090A10",
        voidSurface: "#131422",
        stellarGold: "#D4AF37",
        goldBright: "#F5D77F",
        violetBtnStart: "#5B2B85",
        violetBtnEnd: "#361456",
        lavenderSoft: "#DDD6FE",
        lavenderEthereal: "#C4B5FD",
        // Solfeggio & Cimática
        cyanCymatic: "#38BDF8",
        indigoDeep: "#1E1B4B",
        // Palo de Lluvia
        amberDark: "#1C1008",
        amberDeep: "#120904",
        amberGlow: "#2A160A",
        terracotta: "#8C4024",
        terracottaLight: "#B35433",
        bambooToast: "#A06B33",
        bambooWarm: "#C29B38"
      },
      fontFamily: {
        celestial: ["'Pinyon Script'", "cursive"],
        sacred: ["'Cinzel'", "serif"],
        editorial: ["'Cormorant Garamond'", "Georgia", "serif"],
        sans: ["'Plus Jakarta Sans'", "sans-serif"]
      }
    }
  },
  plugins: []
};
