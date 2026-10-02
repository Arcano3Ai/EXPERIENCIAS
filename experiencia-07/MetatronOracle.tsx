"use client";

import React, { useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  Sparkles,
  Volume2,
  VolumeX,
  RotateCcw,
  CheckCircle2,
  Eye,
  Layers,
  ShieldCheck,
  HelpCircle,
  Feather
} from "lucide-react";

export interface PlatonicSolid {
  id: string;
  name: string;
  element: string;
  faces: number;
  vertices: number;
  colorHex: string;
  glowHex: string;
  meaning: string;
  meditation: string;
  affirmation: string;
}

export const PLATONIC_SOLIDS: PlatonicSolid[] = [
  {
    id: "tetraedro",
    name: "Tetraedro",
    element: "Fuego 🔥",
    faces: 4,
    vertices: 4,
    colorHex: "#EF4444",
    glowHex: "rgba(239, 68, 68, 0.5)",
    meaning: "Poder de ignición, coraje, transmutación rápida y voluntad activa.",
    meditation: "Visualiza un fuego violeta en tu centro disolviendo toda vacilación.",
    affirmation: "Actúo con firmeza y alineo mi voluntad con el propósito supremo."
  },
  {
    id: "hexaedro",
    name: "Hexaedro (Cubo)",
    element: "Tierra 🌍",
    faces: 6,
    vertices: 8,
    colorHex: "#10B981",
    glowHex: "rgba(16, 185, 129, 0.5)",
    meaning: "Estabilidad inquebrantable, límites sanos, enraizamiento y manifestación terrenal.",
    meditation: "Siente tus raíces penetrando el corazón cristalino de la Madre Tierra.",
    affirmation: "Estoy seguro, anclado en la realidad presente y edifico mi vida con orden."
  },
  {
    id: "octaedro",
    name: "Octaedro",
    element: "Aire 💨",
    faces: 8,
    vertices: 6,
    colorHex: "#38BDF8",
    glowHex: "rgba(56, 189, 248, 0.5)",
    meaning: "Equilibrio polar, claridad mental, comunicación sincera e integración de opuestos.",
    meditation: "Respira en el punto medio de tu pecho donde cielo y tierra se encuentran.",
    affirmation: "Encuentro el punto de balance exacto en medio de toda marea."
  },
  {
    id: "icosaedro",
    name: "Icosaedro",
    element: "Agua 💧",
    faces: 20,
    vertices: 12,
    colorHex: "#F59E0B",
    glowHex: "rgba(245, 158, 11, 0.5)",
    meaning: "Fluidez, entrega al cambio, desbloqueo emocional y fertilidad creativa infinita.",
    meditation: "Permite que tus emociones fluyan como río cristalino hacia el océano de la paz.",
    affirmation: "Me rindo con gozo al fluir de la vida; cada cambio es una bendición."
  },
  {
    id: "dodecaedro",
    name: "Dodecaedro",
    element: "Éter / Cosmos 🌌",
    faces: 12,
    vertices: 20,
    colorHex: "#A855F7",
    glowHex: "rgba(168, 85, 247, 0.5)",
    meaning: "Conciencia multidimensional, conexión con el Gran Espíritu y acceso a la geometría divina.",
    meditation: "Expande tu aura más allá de las estrellas sintiendo la unidad con el Todo.",
    affirmation: "Soy un ser eterno de luz cósmica reconociendo su divinidad en el aquí y el ahora."
  }
];

// 13 Nodos de Metatrón (coordenadas relativas 2D normalizadas en base circular de 200x200)
export const METATRON_NODES = [
  { id: 0, x: 100, y: 100, name: "Nodo Central (Fuente Suprema)" },
  // Anillo Interior (6 nodos a radio 36)
  { id: 1, x: 100, y: 64, name: "Kether (Corona)" },
  { id: 2, x: 131.2, y: 82, name: "Chokmah (Sabiduría)" },
  { id: 3, x: 131.2, y: 118, name: "Chesed (Misericordia)" },
  { id: 4, x: 100, y: 136, name: "Tiferet (Belleza)" },
  { id: 5, x: 68.8, y: 118, name: "Netzach (Victoria)" },
  { id: 6, x: 68.8, y: 82, name: "Hod (Esplendor)" },
  // Anillo Exterior (6 nodos a radio 72)
  { id: 7, x: 100, y: 28, name: "Puerta Estelar Norte" },
  { id: 8, x: 162.4, y: 64, name: "Puerta de Orión" },
  { id: 9, x: 162.4, y: 136, name: "Puerta de las Pléyades" },
  { id: 10, x: 100, y: 172, name: "Puerta del Anclaje Terrenal" },
  { id: 11, x: 37.6, y: 136, name: "Puerta de Sirio" },
  { id: 12, x: 37.6, y: 64, name: "Puerta de Arcturus" }
];

export function MetatronOracle() {
  const [selectedSolid, setSelectedSolid] = useState<PlatonicSolid>(PLATONIC_SOLIDS[4]);
  const [selectedNode, setSelectedNode] = useState<number>(0);
  const [isRotating, setIsRotating] = useState(true);
  const [isOracleRevealed, setIsOracleRevealed] = useState(false);
  const [oracleAnswer, setOracleAnswer] = useState<PlatonicSolid | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);

  // Generar las 78 líneas que unen todos los 13 nodos entre sí
  const allLines = useMemo(() => {
    const lines: { x1: number; y1: number; x2: number; y2: number; id: string }[] = [];
    for (let i = 0; i < METATRON_NODES.length; i++) {
      for (let j = i + 1; j < METATRON_NODES.length; j++) {
        lines.push({
          x1: METATRON_NODES[i].x,
          y1: METATRON_NODES[i].y,
          x2: METATRON_NODES[j].x,
          y2: METATRON_NODES[j].y,
          id: `${i}-${j}`
        });
      }
    }
    return lines;
  }, []);

  const playChimeTone = (hz = 963) => {
    if (isAudioMuted) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = audioCtxRef.current || new AudioCtx();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(hz, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.8);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 3.0);
    } catch (e) {}
  };

  const handleConsultOracle = () => {
    const randomIndex = Math.floor(Math.random() * PLATONIC_SOLIDS.length);
    const result = PLATONIC_SOLIDS[randomIndex];
    setOracleAnswer(result);
    setSelectedSolid(result);
    setIsOracleRevealed(true);
    playChimeTone(963);
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-4 space-y-8 text-[#F8F9FA]">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-semibold tracking-widest uppercase">
          <Compass size={14} className="text-purple-400" />
          <span>Geometría Sagrada Multidimensional</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-sacred font-bold text-white tracking-wide">
          Oráculo del Cubo de Metatrón
        </h2>
        <p className="text-xs sm:text-sm text-stone-300 font-sans">
          La matriz geométrica que contiene los 5 Sólidos Platónicos y los 13 vórtices celestiales.
          Activa los códigos de luz para sintonizar con la matemática armónica del cosmos.
        </p>
      </div>

      {/* Grid Principal: Cubo SVG + Panel Oracular */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Visualizador del Cubo de Metatrón (6 cols) */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-4 bg-gradient-to-b from-[#160E1C]/80 via-[#100A16]/90 to-[#07040B] border border-purple-500/25 rounded-3xl relative overflow-hidden shadow-2xl">
          {/* Resplandor violeta de fondo */}
          <div
            className="absolute inset-0 blur-3xl opacity-20 transition-all duration-700 pointer-events-none"
            style={{ backgroundColor: selectedSolid.colorHex }}
          />

          <div className="relative w-72 h-72 sm:w-96 sm:h-96 flex items-center justify-center">
            {/* Contenedor SVG rotatorio */}
            <motion.div
              animate={{ rotate: isRotating ? 360 : 0 }}
              transition={{
                duration: 60,
                repeat: isRotating ? Infinity : 0,
                ease: "linear"
              }}
              className="w-full h-full flex items-center justify-center"
            >
              <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_12px_rgba(168,85,247,0.4)]">
                {/* 78 Líneas de Conexión */}
                {allLines.map((line) => (
                  <line
                    key={line.id}
                    x1={line.x1}
                    y1={line.y1}
                    x2={line.x2}
                    y2={line.y2}
                    stroke="#D4AF37"
                    strokeWidth={0.4}
                    strokeOpacity={0.35}
                  />
                ))}

                {/* 13 Círculos Sagrados de la Fruta de la Vida */}
                {METATRON_NODES.map((node) => {
                  const isNodeSelected = selectedNode === node.id;
                  return (
                    <g key={node.id} onClick={() => {
                      setSelectedNode(node.id);
                      playChimeTone(528 + node.id * 33);
                    }} className="cursor-pointer group">
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={12}
                        fill="#0E0814"
                        fillOpacity={0.8}
                        stroke={isNodeSelected ? "#F5D77F" : selectedSolid.colorHex}
                        strokeWidth={isNodeSelected ? 1.8 : 0.9}
                        className="transition-all duration-300 group-hover:stroke-amber-300"
                      />
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={4}
                        fill={isNodeSelected ? "#F5D77F" : "#A855F7"}
                        className="transition-all"
                      />
                    </g>
                  );
                })}
              </svg>
            </motion.div>
          </div>

          {/* Controles del Cubo */}
          <div className="w-full max-w-sm mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between gap-3 text-xs">
            <button
              onClick={() => setIsRotating(!isRotating)}
              className="px-3.5 py-1.5 rounded-full border border-white/10 bg-white/5 text-stone-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw size={13} className={isRotating ? "animate-spin" : ""} />
              <span>{isRotating ? "Pausar Giro" : "Girar Matriz"}</span>
            </button>

            <span className="text-[11px] font-mono text-purple-300 truncate">
              {METATRON_NODES[selectedNode].name}
            </span>

            <button
              onClick={() => setIsAudioMuted(!isAudioMuted)}
              className="p-2 rounded-full border border-white/10 bg-white/5 text-stone-300 hover:text-white cursor-pointer"
            >
              {isAudioMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
          </div>
        </div>

        {/* Panel de Sólidos Platónicos y Consulta Oracular (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Selector de Sólidos Platónicos */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-wider font-semibold text-purple-300">
                Los 5 Sólidos Platónicos en Metatrón:
              </span>
              <button
                onClick={handleConsultOracle}
                className="px-3.5 py-1.5 rounded-full border border-amber-400 bg-amber-400/20 text-amber-200 text-xs font-semibold flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer"
              >
                <Sparkles size={13} />
                <span>Consulta Oracular</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PLATONIC_SOLIDS.map((solid) => {
                const isSelected = selectedSolid.id === solid.id;
                return (
                  <button
                    key={solid.id}
                    onClick={() => {
                      setSelectedSolid(solid);
                      playChimeTone(741);
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-purple-400 bg-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                        : "border-white/10 bg-[#120C18]/60 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-sacred font-bold text-white">
                        {solid.name}
                      </span>
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: solid.colorHex }}
                      />
                    </div>
                    <span className="text-[10px] text-stone-400 mt-1 block">
                      {solid.element} · {solid.faces} caras
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ficha Revelada del Sólido Activo */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedSolid.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-6 rounded-3xl border border-white/10 bg-gradient-to-b from-[#180E1C] to-[#0A060E] space-y-5 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-sacred font-bold text-white">
                    {selectedSolid.name}
                  </h3>
                  <p className="text-xs text-purple-300 font-sans mt-0.5">
                    Elemento Sagrado: {selectedSolid.element}
                  </p>
                </div>
                <div className="text-right text-xs font-mono text-stone-400">
                  <span>{selectedSolid.faces} Caras</span> · <span>{selectedSolid.vertices} Vértices</span>
                </div>
              </div>

              {/* Significado y Poder */}
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl border border-white/[0.08] bg-white/[0.02]">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-300 block mb-1">
                    Trascendencia Cósmica
                  </span>
                  <p className="text-xs text-stone-200 leading-relaxed font-sans">
                    {selectedSolid.meaning}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl border border-white/[0.08] bg-white/[0.02]">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-purple-300 block mb-1">
                    Visualización Meditativa
                  </span>
                  <p className="text-xs text-stone-300 leading-relaxed font-sans">
                    {selectedSolid.meditation}
                  </p>
                </div>
              </div>

              {/* Decreto Geométrico */}
              <div className="p-4 rounded-2xl border border-purple-400/30 bg-purple-500/10 space-y-1">
                <span className="text-[10px] uppercase font-mono tracking-widest text-purple-300">
                  Activación del Código Platónico
                </span>
                <p className="text-xs sm:text-sm font-editorial italic text-purple-100">
                  "{selectedSolid.affirmation}"
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default MetatronOracle;
