"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  Sparkles,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  RotateCcw,
  CheckCircle2,
  Copy,
  ShieldCheck,
  Eye
} from "lucide-react";

export interface ZodiacSign {
  id: string;
  name: string;
  symbol: string;
  dates: string;
  element: "Fuego 🔥" | "Tierra 🌍" | "Aire 💨" | "Agua 💧";
  modality: "Cardinal" | "Fijo" | "Mutable";
  ruler: string;
  colorHex: string;
  glowHex: string;
  angleDeg: number;
  houseTheme: string;
  cosmicMessage: string;
  powerAffirmation: string;
}

export const ZODIAC_SIGNS: ZodiacSign[] = [
  {
    id: "aries",
    name: "Aries",
    symbol: "♈",
    dates: "21 Mar - 19 Abr",
    element: "Fuego 🔥",
    modality: "Cardinal",
    ruler: "Marte",
    colorHex: "#EF4444",
    glowHex: "rgba(239, 68, 68, 0.4)",
    angleDeg: 0,
    houseTheme: "Casa 1: Identidad, impulso vital y coraje de ser pionero.",
    cosmicMessage: "Eres la chispa divina que inicia los ciclos. Tu fuerza radica en tu audacia auténtica sin máscaras.",
    powerAffirmation: "Yo soy la fuerza pionera que abre caminos luminosos con valor inquebrantable."
  },
  {
    id: "tauro",
    name: "Tauro",
    symbol: "♉",
    dates: "20 Abr - 20 May",
    element: "Tierra 🌍",
    modality: "Fijo",
    ruler: "Venus",
    colorHex: "#10B981",
    glowHex: "rgba(16, 185, 129, 0.4)",
    angleDeg: 30,
    houseTheme: "Casa 2: Abundancia material, valor propio y placer sensorial.",
    cosmicMessage: "La Tierra fértil te sostiene. Tu poder es la constancia paciente y la manifestación de belleza duradera.",
    powerAffirmation: "Merezco la belleza y la abundancia; mi templo físico florece en paz."
  },
  {
    id: "geminis",
    name: "Géminis",
    symbol: "♊",
    dates: "21 May - 20 Jun",
    element: "Aire 💨",
    modality: "Mutable",
    ruler: "Mercurio",
    colorHex: "#38BDF8",
    glowHex: "rgba(56, 189, 248, 0.4)",
    angleDeg: 60,
    houseTheme: "Casa 3: Comunicación lúcida, mente ágil y curiosidad creadora.",
    cosmicMessage: "Eres el puente entre mentes y mundos. Tus palabras tienen el poder de tejer realidades y disipar dudas.",
    powerAffirmation: "Mi mente es un río de ideas brillantes; expreso mi verdad con alegría."
  },
  {
    id: "cancer",
    name: "Cáncer",
    symbol: "♋",
    dates: "21 Jun - 22 Jul",
    element: "Agua 💧",
    modality: "Cardinal",
    ruler: "Luna",
    colorHex: "#818CF8",
    glowHex: "rgba(129, 140, 248, 0.4)",
    angleDeg: 90,
    houseTheme: "Casa 4: Raíces del alma, hogar sagrado y memoria ancestral.",
    cosmicMessage: "En la marea de tus emociones reside tu sabiduría oracular. Nutre tu refugio interior con ternura.",
    powerAffirmation: "Honro mis raíces y habito mi corazón como el más dulce de los templos."
  },
  {
    id: "leo",
    name: "Leo",
    symbol: "♌",
    dates: "23 Jul - 22 Ago",
    element: "Fuego 🔥",
    modality: "Fijo",
    ruler: "Sol",
    colorHex: "#F59E0B",
    glowHex: "rgba(245, 158, 11, 0.4)",
    angleDeg: 120,
    houseTheme: "Casa 5: Creatividad radiante, gozo del niño interior y liderazgo.",
    cosmicMessage: "Brillas sin pedir permiso. Tu generosidad y alegría encienden la esperanza en quienes te rodean.",
    powerAffirmation: "Mi luz es un regalo divino; comparto mi corazón con grandeza y calidez."
  },
  {
    id: "virgo",
    name: "Virgo",
    symbol: "♍",
    dates: "23 Ago - 22 Sep",
    element: "Tierra 🌍",
    modality: "Mutable",
    ruler: "Quirón / Mercurio",
    colorHex: "#84CC16",
    glowHex: "rgba(132, 204, 22, 0.4)",
    angleDeg: 150,
    houseTheme: "Casa 6: Alquimia cotidiana, discernimiento y sanación del cuerpo.",
    cosmicMessage: "En cada detalle habita lo sagrado. Tu discernimiento es una medicina de orden para el mundo.",
    powerAffirmation: "Mi cuerpo es un templo sabio; cada día me purifico en devoción y servicio."
  },
  {
    id: "libra",
    name: "Libra",
    symbol: "♎",
    dates: "23 Sep - 22 Oct",
    element: "Aire 💨",
    modality: "Cardinal",
    ruler: "Venus",
    colorHex: "#EC4899",
    glowHex: "rgba(236, 72, 153, 0.4)",
    angleDeg: 180,
    houseTheme: "Casa 7: Espejo de las relaciones, armonía, justicia y empatía.",
    cosmicMessage: "Eres el artista del equilibrio. Recuerda que la verdadera armonía comienza dentro de tu propio pecho.",
    powerAffirmation: "Elijo relaciones lúcidas basadas en la reciprocidad, el amor y la verdad."
  },
  {
    id: "escorpio",
    name: "Escorpio",
    symbol: "♏",
    dates: "23 Oct - 21 Nov",
    element: "Agua 💧",
    modality: "Fijo",
    ruler: "Plutón / Marte",
    colorHex: "#A855F7",
    glowHex: "rgba(168, 85, 247, 0.4)",
    angleDeg: 210,
    houseTheme: "Casa 8: Transformación del fénix, sexualidad sagrada e inconsciente.",
    cosmicMessage: "No le temas a tus profundidades; allí se forjan tus alas de fénix para resurgir invencible.",
    powerAffirmation: "Abrazo mi poder de transmutación; suelto el pasado y renazco en luz."
  },
  {
    id: "sagitario",
    name: "Sagitario",
    symbol: "♐",
    dates: "22 Nov - 21 Dic",
    element: "Fuego 🔥",
    modality: "Mutable",
    ruler: "Júpiter",
    colorHex: "#F97316",
    glowHex: "rgba(249, 115, 22, 0.4)",
    angleDeg: 240,
    houseTheme: "Casa 9: Expansión de conciencia, filosofía superior y horizontes.",
    cosmicMessage: "Tu flecha apunta a las estrellas más altas. La fe y el optimismo son tus llaves dimensionales.",
    powerAffirmation: "Confío en el viaje de mi alma; el cosmos siempre expande mi visión."
  },
  {
    id: "capricornio",
    name: "Capricornio",
    symbol: "♑",
    dates: "22 Dic - 19 Ene",
    element: "Tierra 🌍",
    modality: "Cardinal",
    ruler: "Saturno",
    colorHex: "#64748B",
    glowHex: "rgba(100, 116, 139, 0.4)",
    angleDeg: 270,
    houseTheme: "Casa 10: Maestría personal, vocación suprema e integridad.",
    cosmicMessage: "La cumbre de la montaña espera tus pasos firmes. Construye tu legado sobre cimientos de honor y verdad.",
    powerAffirmation: "Soy el sabio arquitecto de mi destino; nada frena mi determinación impecable."
  },
  {
    id: "acuario",
    name: "Acuario",
    symbol: "♒",
    dates: "20 Ene - 18 Feb",
    element: "Aire 💨",
    modality: "Fijo",
    ruler: "Urano / Saturno",
    colorHex: "#06B6D4",
    glowHex: "rgba(6, 182, 212, 0.4)",
    angleDeg: 300,
    houseTheme: "Casa 11: Comunidad cuántica, innovación y libertad del futuro.",
    cosmicMessage: "Eres una visión del mañana caminando en el presente. Tu originalidad es el despertar de la colmena.",
    powerAffirmation: "Celebro mi autenticidad única y proyecto libertad sobre toda la humanidad."
  },
  {
    id: "piscis",
    name: "Piscis",
    symbol: "♓",
    dates: "19 Feb - 20 Mar",
    element: "Agua 💧",
    modality: "Mutable",
    ruler: "Neptuno / Júpiter",
    colorHex: "#C084FC",
    glowHex: "rgba(192, 132, 252, 0.4)",
    angleDeg: 330,
    houseTheme: "Casa 12: Unidad mística, perdón universal y sueños del Gran Misterio.",
    cosmicMessage: "Gota de agua y océano a la vez. Tu compasión infinita abraza el dolor del mundo y lo disuelve en amor.",
    powerAffirmation: "Descanso en la corriente divina; el amor del cosmos fluye a través de mí."
  }
];

export function AstralChart() {
  const [selectedSign, setSelectedSign] = useState<ZodiacSign>(ZODIAC_SIGNS[0]);
  const [isRotating, setIsRotating] = useState(true);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [copied, setCopied] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);

  const playStarChime = () => {
    if (isAudioMuted) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = audioCtxRef.current || new AudioCtx();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(741, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1110, ctx.currentTime + 1.5);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.07, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 2.7);
    } catch (e) {}
  };

  const handleSelectSign = (sign: ZodiacSign) => {
    setSelectedSign(sign);
    playStarChime();
  };

  const handleCopyAffirmation = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(selectedSign.powerAffirmation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-4 space-y-8 text-[#F8F9FA]">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-semibold tracking-widest uppercase">
          <Compass size={14} className="text-purple-400" />
          <span>Bóveda Celeste & Rueda Zodiacal</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-sacred font-bold text-white tracking-wide">
          Carta Astral y Matriz Estelar
        </h2>
        <p className="text-xs sm:text-sm text-stone-300 font-sans">
          Navega por la rueda de los 12 arquetipos zodiacales y las casas cósmicas.
          Comprende el propósito evolutivo grabado en las estrellas en el instante de tu nacimiento.
        </p>
      </div>

      {/* Grid: Rueda Zodiacal SVG + Panel de Arquetipos */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Rueda Zodiacal SVG (6 cols) */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-4 bg-gradient-to-b from-[#130E1F]/80 via-[#0B0714]/90 to-[#040208] border border-purple-500/25 rounded-3xl relative overflow-hidden shadow-2xl">
          {/* Resplandor de fondo del signo */}
          <div
            className="absolute inset-0 blur-3xl opacity-20 pointer-events-none transition-all duration-700"
            style={{ backgroundColor: selectedSign.colorHex }}
          />

          <div className="relative w-72 h-72 sm:w-96 sm:h-96 flex items-center justify-center select-none">
            {/* Contenedor Giratorio */}
            <motion.div
              animate={{ rotate: isRotating ? 360 : 0 }}
              transition={{ duration: 120, repeat: isRotating ? Infinity : 0, ease: "linear" }}
              className="w-full h-full flex items-center justify-center"
            >
              <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                {/* Círculos de la Rueda */}
                <circle cx={100} cy={100} r={95} fill="none" stroke="#D4AF37" strokeWidth={1} strokeOpacity={0.6} />
                <circle cx={100} cy={100} r={65} fill="#0B0612" stroke="#D4AF37" strokeWidth={0.8} strokeOpacity={0.4} />
                <circle cx={100} cy={100} r={35} fill="#140B22" stroke="#8B5CF6" strokeWidth={0.6} />

                {/* 12 Sectores Zodiacales */}
                {ZODIAC_SIGNS.map((sign, index) => {
                  const angle = (index * 30 * Math.PI) / 180;
                  const x = 100 + Math.cos(angle) * 80;
                  const y = 100 + Math.sin(angle) * 80;
                  const isCurrent = selectedSign.id === sign.id;

                  return (
                    <g key={sign.id} onClick={() => handleSelectSign(sign)} className="cursor-pointer group">
                      <line
                        x1={100}
                        y1={100}
                        x2={100 + Math.cos(angle) * 95}
                        y2={100 + Math.sin(angle) * 95}
                        stroke="#D4AF37"
                        strokeWidth={0.5}
                        strokeOpacity={0.25}
                      />
                      <circle
                        cx={x}
                        cy={y}
                        r={9}
                        fill={isCurrent ? sign.colorHex : "#12081E"}
                        stroke={isCurrent ? "#F5D77F" : "#A855F7"}
                        strokeWidth={isCurrent ? 1.5 : 0.8}
                        className="transition-all duration-300"
                      />
                      <text
                        x={x}
                        y={y + 3.5}
                        textAnchor="middle"
                        fontSize={8}
                        fill={isCurrent ? "#FFFFFF" : "#CBD5E1"}
                        fontWeight="bold"
                        className="pointer-events-none select-none"
                      >
                        {sign.symbol}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </motion.div>

            {/* Centro Fijo con Signo Activo */}
            <div className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-[#120820]/90 border border-amber-400/40 backdrop-blur-md flex flex-col items-center justify-center p-1 text-center shadow-2xl pointer-events-none">
              <span className="text-2xl">{selectedSign.symbol}</span>
              <span className="text-[10px] font-sacred font-bold text-amber-300 truncate max-w-[70px]">
                {selectedSign.name}
              </span>
            </div>
          </div>

          {/* Barra de Controles de la Bóveda */}
          <div className="w-full max-w-sm mt-3 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs">
            <button
              onClick={() => setIsRotating(!isRotating)}
              className="px-3.5 py-1.5 rounded-full border border-white/10 bg-white/5 text-stone-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw size={13} className={isRotating ? "animate-spin" : ""} />
              <span>{isRotating ? "Detener Bóveda" : "Girar Bóveda"}</span>
            </button>

            <span className="text-[11px] font-mono text-purple-300">
              {selectedSign.element}
            </span>

            <button
              onClick={() => setIsAudioMuted(!isAudioMuted)}
              className="p-2 rounded-full border border-white/10 bg-white/5 text-stone-300 hover:text-white cursor-pointer"
            >
              {isAudioMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
          </div>
        </div>

        {/* Panel de Arquetipos y Mensaje Cósmico (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Selector de los 12 Signos */}
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-purple-300 block mb-2.5">
              Los 12 Signos del Zodíaco Sagrado:
            </span>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
              {ZODIAC_SIGNS.map((sign) => {
                const isSelected = selectedSign.id === sign.id;
                return (
                  <button
                    key={sign.id}
                    onClick={() => handleSelectSign(sign)}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center ${
                      isSelected
                        ? "border-amber-400 bg-purple-600/30 text-white shadow-md scale-102"
                        : "border-white/10 bg-white/5 text-stone-400 hover:text-white hover:border-white/20"
                    }`}
                  >
                    <span className="text-sm">{sign.symbol}</span>
                    <span className="text-[10px] font-sacred font-bold truncate max-w-[65px]">
                      {sign.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ficha Activa del Signo */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedSign.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-6 rounded-3xl border border-white/10 bg-gradient-to-b from-[#180F26] to-[#0A0612] space-y-5 shadow-2xl"
            >
              <div className="border-b border-white/10 pb-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{selectedSign.symbol}</span>
                    <h3 className="text-2xl font-sacred font-bold text-white">
                      {selectedSign.name}
                    </h3>
                  </div>
                  <p className="text-xs text-purple-300 font-sans mt-0.5">
                    {selectedSign.dates} · Regente: {selectedSign.ruler}
                  </p>
                </div>

                <div className="text-right text-xs">
                  <span className="px-3 py-1 rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-300 font-mono">
                    {selectedSign.element}
                  </span>
                  <p className="text-[11px] text-stone-400 mt-1 font-mono">
                    Modalidad {selectedSign.modality}
                  </p>
                </div>
              </div>

              {/* Tema de la Casa */}
              <div className="p-3.5 rounded-2xl border border-white/[0.08] bg-white/[0.02]">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-300 block mb-1">
                  Enfoque Evolutivo de Casa
                </span>
                <p className="text-xs text-stone-200 leading-relaxed font-sans">
                  {selectedSign.houseTheme}
                </p>
              </div>

              {/* Mensaje Cósmico */}
              <div className="p-3.5 rounded-2xl border border-white/[0.08] bg-white/[0.02]">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-purple-300 block mb-1">
                  Mensaje del Cielo para tu Alma
                </span>
                <p className="text-xs text-stone-300 leading-relaxed font-sans">
                  "{selectedSign.cosmicMessage}"
                </p>
              </div>

              {/* Afirmación de Poder */}
              <div className="p-4 rounded-2xl border border-amber-400/30 bg-purple-500/10 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-amber-300">
                    Decreto Cósmico
                  </span>
                  <p className="text-xs sm:text-sm font-editorial italic text-purple-100">
                    "{selectedSign.powerAffirmation}"
                  </p>
                </div>
                <button
                  onClick={handleCopyAffirmation}
                  className="p-2.5 rounded-xl border border-amber-400/30 bg-amber-400/20 text-amber-200 hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer"
                  title="Copiar decreto"
                >
                  {copied ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Copy size={16} />}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default AstralChart;
