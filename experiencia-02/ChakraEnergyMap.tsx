"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  HeartHandshake,
  Radio,
  CheckCircle2,
  Copy,
  MessageCircle,
  ChevronRight,
  Info,
  Flame,
  Activity,
  ArrowUpRight,
  Compass
} from "lucide-react";

export interface Chakra {
  id: string;
  name: string;
  sanskrit: string;
  yPercent: number; // Porcentaje vertical en la silueta (0-100)
  colorHex: string;
  secondaryColorHex?: string;
  frequency: string;
  balanceState: string;
  blockedState: string;
  holisticTherapy: string;
  affirmation: string;
  icon?: string;
}

export const CHAKRAS_DATA: Chakra[] = [
  {
    id: "corona",
    name: "Chakra Corona",
    sanskrit: "Sahasrara",
    yPercent: 12,
    colorHex: "#A855F7",
    secondaryColorHex: "#FFFFFF",
    frequency: "963 Hz · Conexión divina",
    balanceState: "Claridad mental, paz profunda y conexión espiritual.",
    blockedState: "Vacío existencial, confusión y desconexión de la fuente.",
    holisticTherapy: "Lectura de Registros Akáshicos y Sanación Cuántica.",
    affirmation: "Yo soy conciencia divina conectada con el Todo."
  },
  {
    id: "tercer-ojo",
    name: "Chakra Tercer Ojo",
    sanskrit: "Ajna",
    yPercent: 20,
    colorHex: "#6366F1",
    secondaryColorHex: "#818CF8",
    frequency: "852 Hz · Intuición pura",
    balanceState: "Claridad intuitiva, percepción lúcida y sabiduría interna.",
    blockedState: "Sobrecarga mental, estrés y falta de visión o rumbo.",
    holisticTherapy: "Lectura de Tarot Terapéutico y Canalización.",
    affirmation: "Confío en mi visión interior y mi sabiduría."
  },
  {
    id: "garganta",
    name: "Chakra Garganta",
    sanskrit: "Vishuddha",
    yPercent: 30,
    colorHex: "#0EA5E9",
    secondaryColorHex: "#38BDF8",
    frequency: "741 Hz · Expresión auténtica",
    balanceState: "Comunicación asertiva, decir tu verdad sin miedo y creatividad vocal.",
    blockedState: "Nudo en la garganta, callar emociones, timidez y represión.",
    holisticTherapy: "Meditación con Arcángel Gabriel y Reiki Usui.",
    affirmation: "Expreso mi verdad con amor, libertad y calma."
  },
  {
    id: "corazon",
    name: "Chakra Corazón",
    sanskrit: "Anahata",
    yPercent: 42,
    colorHex: "#10B981",
    secondaryColorHex: "#F472B6",
    frequency: "639 Hz · Amor incondicional",
    balanceState: "Compasión, perdón, capacidad de dar y recibir afecto puro.",
    blockedState: "Duelo no resuelto, rencor, corazas y miedo a la vulnerabilidad.",
    holisticTherapy: "Sesión de Reiki Usui & Sanación con Arcángel Rafael.",
    affirmation: "Mi corazón está abierto para dar y recibir amor en paz."
  },
  {
    id: "plexo-solar",
    name: "Chakra Plexo Solar",
    sanskrit: "Manipura",
    yPercent: 53,
    colorHex: "#F59E0B",
    secondaryColorHex: "#FBBF24",
    frequency: "528 Hz · Transformación y poder personal",
    balanceState: "Autoconfianza, fuerza de voluntad, liderazgo y límites sanos.",
    blockedState: "Inseguridad, necesidad de control obsesivo, fatiga y baja autoestima.",
    holisticTherapy: "Activación de Energía Kundalini y Reiki.",
    affirmation: "Reconozco mi poder personal y actúo con seguridad."
  },
  {
    id: "sacro",
    name: "Chakra Sacro",
    sanskrit: "Svadhisthana",
    yPercent: 65,
    colorHex: "#F97316",
    secondaryColorHex: "#FB923C",
    frequency: "417 Hz · Creatividad y placer",
    balanceState: "Fluidez emocional, gozo de vivir, sensualidad y energía creadora.",
    blockedState: "Culpa, apatía, bloqueos creativos, vergüenza o dolor pélvico.",
    holisticTherapy: "Sacerdotisa de Sexualidad Sagrada y Sanación de Útero.",
    affirmation: "Honro mi cuerpo, mi creatividad y mi derecho al gozo."
  },
  {
    id: "raiz",
    name: "Chakra Raíz",
    sanskrit: "Muladhara",
    yPercent: 78,
    colorHex: "#EF4444",
    secondaryColorHex: "#DC2626",
    frequency: "396 Hz · Seguridad y enraizamiento",
    balanceState: "Sensación de seguridad, estabilidad financiera, presencia y vitalidad física.",
    blockedState: "Miedo constante, ansiedad de supervivencia, desarraigo e inestabilidad.",
    holisticTherapy: "Armonización con Arcángel Miguel y Enraizamiento.",
    affirmation: "Estoy seguro, sostenido y enraizado a la Madre Tierra."
  }
];

export interface ChakraEnergyMapProps {
  className?: string;
  onChakraSelect?: (chakra: Chakra) => void;
}

export const ChakraEnergyMap: React.FC<ChakraEnergyMapProps> = ({
  className = "",
  onChakraSelect
}) => {
  const [activeChakra, setActiveChakra] = useState<Chakra | null>(CHAKRAS_DATA[3]);
  const [copiedAffirmation, setCopiedAffirmation] = useState(false);

  const handleCopy = (text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedAffirmation(true);
      setTimeout(() => setCopiedAffirmation(false), 2200);
    }
  };

  const activeColor = activeChakra ? activeChakra.colorHex : "#D4AF37";

  return (
    <section
      className={`relative w-full overflow-hidden py-16 px-4 sm:px-6 lg:px-8 text-slate-100 transition-colors duration-1000 ${className}`}
      style={{ backgroundColor: "#090A10" }}
      aria-label="Kit de Herramientas - Mapa Energético de Chakras"
    >
      {/* Resplandor ambiental radial que tiñe suavemente la escena según el chakra activo */}
      <div
        className="pointer-events-none absolute inset-0 transition-all duration-700 ease-out"
        style={{
          background: activeChakra
            ? `radial-gradient(ellipse 60% 50% at 35% 45%, ${activeChakra.colorHex}20 0%, ${activeChakra.colorHex}05 45%, transparent 75%)`
            : "radial-gradient(ellipse 50% 45% at 50% 40%, rgba(212,175,55,0.06) 0%, transparent 70%)"
        }}
      />

      {/* Cuadrícula o textura sutil de templo */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:28px_28px]" />

      <div className="relative mx-auto max-w-6xl">
        {/* Encabezado */}
        <header className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-400/20 bg-amber-400/5 text-amber-300 text-xs uppercase tracking-widest font-medium mb-3">
            <Radio size={13} className="text-amber-300" />
            <span>Diagnóstico Bioenergético Integral</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif tracking-wider text-slate-50 font-normal">
            Mapa de los <span className="italic text-amber-200">7 Centros de Energía</span>
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base max-w-2xl mx-auto font-sans leading-relaxed">
            Explora la anatomía sutil de tu ser. Haz clic o pasa el cursor sobre cada punto para descubrir
            dónde fluye tu vitalidad y qué medicina energética equilibra tu frecuencia.
          </p>
        </header>

        {/* Layout Principal de 2 Columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* COLUMNA IZQUIERDA: Silueta en Padmasana con Nodos Interactivos */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-[340px] sm:max-w-[420px] aspect-[3/4] flex items-center justify-center select-none">
              
              {/* Círculo sagrado de aura alrededor de la silueta */}
              <div
                className="absolute inset-4 rounded-full border border-white/[0.04] transition-all duration-700"
                style={{
                  boxShadow: activeChakra
                    ? `inset 0 0 60px ${activeChakra.colorHex}15, 0 0 50px ${activeChakra.colorHex}10`
                    : "none"
                }}
              />

              {/* Columna de Luz Central (Canal Sushumna) */}
              <div className="absolute top-[8%] bottom-[18%] left-1/2 -translate-x-1/2 w-[2px] bg-gradient-to-b from-purple-400/30 via-emerald-400/30 to-red-500/30 blur-[1px]" />
              <div
                className="absolute top-[8%] bottom-[18%] left-1/2 -translate-x-1/2 w-[1px] transition-colors duration-700"
                style={{
                  backgroundColor: activeChakra ? activeChakra.colorHex : "rgba(255,255,255,0.25)"
                }}
              />

              {/* Silueta Humana Vectorial en Flor de Loto (Padmasana) */}
              <svg
                viewBox="0 0 400 500"
                className="w-full h-full drop-shadow-2xl overflow-visible pointer-events-none"
                aria-hidden="true"
              >
                <defs>
                  {/* Gradiente de trazo refinado */}
                  <linearGradient id="bodyStrokeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FAF3E0" stopOpacity="0.45" />
                    <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#A78BFA" stopOpacity="0.2" />
                  </linearGradient>

                  {/* Resplandor del aura */}
                  <radialGradient id="headAura" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FAF3E0" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#090A10" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Aura superior tenue de la cabeza */}
                <circle cx="200" cy="70" r="55" fill="url(#headAura)" />

                {/* Silueta estilizada (Líneas fluidas y etéreas) */}
                <g fill="none" stroke="url(#bodyStrokeGrad)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  {/* Cabeza y cuello */}
                  <path d="M200,32 C178,32 166,50 166,74 C166,98 180,114 192,122 L192,136 L208,136 L208,122 C220,114 234,98 234,74 C234,50 222,32 200,32 Z" />
                  
                  {/* Clavículas y hombros */}
                  <path d="M192,136 C168,142 135,152 118,172 C108,184 100,205 98,228" />
                  <path d="M208,136 C232,142 265,152 282,172 C292,184 300,205 302,228" />

                  {/* Brazos descansando hacia las rodillas */}
                  <path d="M98,228 C95,255 86,295 78,335 C70,375 88,405 110,405 C130,405 145,395 160,375" />
                  <path d="M302,228 C305,255 314,295 322,335 C330,375 312,405 290,405 C270,405 255,395 240,375" />

                  {/* Torso lateral */}
                  <path d="M142,180 C150,215 152,245 148,275 C144,305 140,335 152,365" />
                  <path d="M258,180 C250,215 248,245 252,275 C256,305 260,335 248,365" />

                  {/* Base de piernas cruzadas (Loto / Padmasana) */}
                  <path d="M78,390 C60,402 52,420 72,435 C95,450 150,455 200,455 C250,455 305,450 328,435 C348,420 340,402 322,390" />
                  <path d="M110,405 C140,425 170,432 200,432 C230,432 260,425 290,405" />

                  {/* Manos en mudra en el regazo */}
                  <path d="M175,372 C190,380 210,380 225,372" strokeWidth="1.25" opacity="0.6" />
                </g>
              </svg>

              {/* Nodos Interactivos de los 7 Chakras */}
              <div className="absolute inset-0">
                {CHAKRAS_DATA.map((chakra) => {
                  const isActive = activeChakra?.id === chakra.id;
                  return (
                    <div
                      key={chakra.id}
                      className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
                      style={{ top: `${chakra.yPercent}%` }}
                    >
                      <button
                        onClick={() => setActiveChakra(chakra)}
                        onMouseEnter={() => setActiveChakra(chakra)}
                        onFocus={() => setActiveChakra(chakra)}
                        aria-label={`${chakra.name} (${chakra.sanskrit}) - ${chakra.frequency}`}
                        aria-pressed={isActive}
                        className="group relative flex items-center justify-center p-3 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                      >
                        {/* Halo pulsante animado continuo */}
                        <span
                          className={`absolute w-7 h-7 rounded-full opacity-60 transition-transform duration-500 ${
                            isActive ? "scale-150 animate-ping" : "group-hover:scale-125"
                          }`}
                          style={{ backgroundColor: chakra.colorHex }}
                        />

                        {/* Halo secundario exterior suave */}
                        <span
                          className="absolute w-6 h-6 rounded-full border transition-all duration-300"
                          style={{
                            borderColor: isActive ? chakra.colorHex : `${chakra.colorHex}60`,
                            backgroundColor: `${chakra.colorHex}15`
                          }}
                        />

                        {/* Núcleo de luz central brillante */}
                        <span
                          className={`relative w-3.5 h-3.5 rounded-full shadow-lg transition-transform duration-300 ${
                            isActive ? "scale-125" : "group-hover:scale-110"
                          }`}
                          style={{
                            backgroundColor: chakra.colorHex,
                            boxShadow: `0 0 14px 2px ${chakra.colorHex}`
                          }}
                        />

                        {/* Etiqueta tooltip flotante visible en hover/active (solo desktop) */}
                        <span
                          className={`hidden md:block absolute left-full ml-3 px-2.5 py-1 rounded-md text-[11px] font-sans font-medium whitespace-nowrap transition-all duration-200 pointer-events-none ${
                            isActive
                              ? "opacity-100 translate-x-0 bg-slate-900/90 text-white border border-white/10 shadow-lg"
                              : "opacity-0 -translate-x-2 group-hover:opacity-80 group-hover:translate-x-0 bg-black/60 text-slate-300"
                          }`}
                        >
                          <span className="font-semibold">{chakra.name.replace("Chakra ", "")}</span>{" "}
                          <span className="opacity-60 italic font-serif">({chakra.sanskrit})</span>
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selector rápido móvil de chakras en chips horizontales scrollables */}
            <div className="flex md:hidden items-center justify-start gap-2 mt-4 overflow-x-auto max-w-full px-2 py-2">
              {CHAKRAS_DATA.map((ch) => {
                const isSelected = activeChakra?.id === ch.id;
                return (
                  <button
                    key={ch.id}
                    onClick={() => setActiveChakra(ch)}
                    className={`shrink-0 px-3 py-1.5 rounded-full border text-xs font-serif transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? "shadow-md scale-105"
                        : "opacity-80 hover:opacity-100"
                    }`}
                    style={{
                      borderColor: ch.colorHex,
                      backgroundColor: isSelected ? `${ch.colorHex}35` : `${ch.colorHex}15`,
                      color: isSelected ? "#FFFFFF" : "#E2E8F0"
                    }}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ch.colorHex }} />
                    <span className="font-semibold">{ch.name.replace("Chakra ", "")}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* COLUMNA DERECHA: Tarjeta de Cristal (Glassmorphism Card) */}
          <div className="lg:col-span-6 min-h-[460px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {activeChakra ? (
                <motion.div
                  key={activeChakra.id}
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 0.98 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="relative rounded-2xl border bg-[#131422]/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl overflow-hidden"
                  style={{
                    borderColor: `${activeChakra.colorHex}45`,
                    boxShadow: `0 15px 40px -10px ${activeChakra.colorHex}25`
                  }}
                >
                  {/* Resplandor interno de esquina */}
                  <div
                    className="pointer-events-none absolute -top-12 -right-12 w-48 h-48 rounded-full blur-2xl opacity-20"
                    style={{ backgroundColor: activeChakra.colorHex }}
                  />

                  {/* Barra superior de identificación */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] pb-4 mb-5">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-3.5 h-3.5 rounded-full shadow-sm"
                        style={{ backgroundColor: activeChakra.colorHex }}
                      />
                      <div>
                        <h3 className="text-xl sm:text-2xl font-serif text-white tracking-wide font-normal">
                          {activeChakra.name}
                        </h3>
                        <p className="text-xs font-serif italic text-amber-200/90">
                          {activeChakra.sanskrit} · Centro Energético
                        </p>
                      </div>
                    </div>

                    <span
                      className="text-[11px] font-sans px-2.5 py-1 rounded-full border uppercase tracking-wider font-semibold"
                      style={{
                        backgroundColor: `${activeChakra.colorHex}15`,
                        borderColor: `${activeChakra.colorHex}40`,
                        color: activeChakra.colorHex
                      }}
                    >
                      {activeChakra.frequency}
                    </span>
                  </div>

                  {/* Estados de Balance y Bloqueo */}
                  <div className="space-y-4 mb-6">
                    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 mb-1">
                        <CheckCircle2 size={14} />
                        <span>En Estado de Balance</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                        {activeChakra.balanceState}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 mb-1">
                        <Activity size={14} />
                        <span>Signos de Bloqueo o Fuga Energética</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {activeChakra.blockedState}
                      </p>
                    </div>
                  </div>

                  {/* Terapia recomendada */}
                  <div className="p-4 rounded-xl border border-amber-400/20 bg-amber-400/5 mb-6">
                    <span className="text-[11px] uppercase tracking-widest text-amber-300/90 font-medium block mb-1">
                      Prescripción Holística Sugerida
                    </span>
                    <p className="text-sm font-serif text-amber-100 font-medium flex items-center gap-2">
                      <Sparkles size={15} className="text-amber-300 shrink-0" />
                      {activeChakra.holisticTherapy}
                    </p>
                  </div>

                  {/* Afirmación del Chakra */}
                  <div className="relative p-4 rounded-xl bg-black/40 border border-white/[0.06] mb-6">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-sans uppercase tracking-wider text-slate-400">
                        Afirmación de Poder
                      </span>
                      <button
                        onClick={() => handleCopy(activeChakra.affirmation)}
                        className="text-[11px] flex items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors"
                        title="Copiar afirmación"
                      >
                        {copiedAffirmation ? (
                          <>
                            <CheckCircle2 size={12} className="text-emerald-400" />
                            <span className="text-emerald-400">Copiada</span>
                          </>
                        ) : (
                          <>
                            <Copy size={12} />
                            <span>Copiar</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-sm sm:text-base font-serif italic text-slate-100 leading-relaxed">
                      «{activeChakra.affirmation}»
                    </p>
                  </div>

                  {/* Acción del Kit: Copiar Decreto de Armonización */}
                  <div>
                    <button
                      onClick={() => handleCopy(`Decreto para ${activeChakra.name} (${activeChakra.frequency}): ${activeChakra.affirmation}`)}
                      className="group flex items-center justify-center gap-2.5 w-full py-3.5 px-6 rounded-xl font-medium text-sm transition-all duration-300 text-slate-950 font-sans shadow-lg hover:shadow-xl hover:scale-[1.01] cursor-pointer"
                      style={{
                        backgroundColor: "#D4AF37",
                        backgroundImage: "linear-gradient(135deg, #FAF3E0 0%, #D4AF37 55%, #AA820A 100%)"
                      }}
                    >
                      <Sparkles size={18} className="fill-slate-950 text-slate-950" />
                      <span>{copiedAffirmation ? "Decreto Copiado al Portapapeles" : "Copiar Decreto de Armonización"}</span>
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* Estado Inicial / Default sin selección previa */
                <motion.div
                  key="empty-state"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="relative rounded-2xl border border-white/[0.08] bg-[#131422]/60 backdrop-blur-xl p-8 sm:p-10 text-center shadow-xl space-y-6"
                >
                  <div className="w-16 h-16 mx-auto rounded-full bg-amber-400/10 border border-amber-400/25 flex items-center justify-center text-amber-300">
                    <Compass size={28} strokeWidth={1.5} className="animate-spin-slow" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-serif text-white tracking-wide">
                      Sintoniza tu Campo Áurico
                    </h3>
                    <p className="mt-3 text-sm sm:text-base text-slate-300 font-sans leading-relaxed max-w-md mx-auto">
                      Pasa el cursor o presiona sobre cada centro de energía en la silueta para escuchar
                      lo que tu cuerpo y alma necesitan decirte hoy.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/[0.06] flex items-center justify-center gap-2 text-xs text-slate-400">
                    <Sparkles size={14} className="text-amber-300" />
                    <span>7 Centros · Frecuencias Solfeggio · Terapia Holística</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChakraEnergyMap;
