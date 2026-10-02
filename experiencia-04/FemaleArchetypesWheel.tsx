"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Moon,
  Sparkles,
  Heart,
  Flame,
  Feather,
  Compass,
  Volume2,
  VolumeX,
  Copy,
  CheckCircle2,
  Calendar,
  Flower2,
  ChevronRight,
  ShieldCheck,
  RotateCcw
} from "lucide-react";

export interface ArchetypeData {
  id: string;
  name: string;
  phase: string;
  lunarPhase: string;
  season: string;
  cycleDays: string;
  colorHex: string;
  accentColor: string;
  glowColor: string;
  hzFrequency: number;
  essence: string;
  emotionalTone: string;
  superpower: string;
  shadowWarning: string;
  botany: string[];
  ritual: string;
  affirmation: string;
}

export const ARCHETYPES: ArchetypeData[] = [
  {
    id: "doncella",
    name: "La Doncella",
    phase: "Fase Folicular (Pre-ovulatoria)",
    lunarPhase: "Luna Creciente 🌒",
    season: "Primavera Interior",
    cycleDays: "Días 6 - 12",
    colorHex: "#38BDF8",
    accentColor: "#F472B6",
    glowColor: "rgba(56, 189, 248, 0.4)",
    hzFrequency: 417,
    essence: "Dinamismo, inspiración naciente, enfoque intelectual y acción imparable.",
    emotionalTone: "Optimismo radiante, curiosidad lúdica y confianza en nuevos comienzos.",
    superpower: "Planificación estratégica, claridad mental e inicio de proyectos audaces.",
    shadowWarning: "Impaciencia, dispersión y autoexigencia desmedida.",
    botany: ["Romero estimulante", "Menta piperita", "Ginkgo Biloba"],
    ritual: "Siembra simbólica de intenciones en una libreta nueva al amanecer.",
    affirmation: "Me abro con alegría a nuevos senderos; mi energía florece con determinación divina."
  },
  {
    id: "madre",
    name: "La Madre",
    phase: "Fase Ovulatoria",
    lunarPhase: "Luna Llena 🌕",
    season: "Verano Interior",
    cycleDays: "Días 13 - 17",
    colorHex: "#F59E0B",
    accentColor: "#EC4899",
    glowColor: "rgba(245, 158, 11, 0.4)",
    hzFrequency: 528,
    essence: "Nutrición, empatía expansiva, magnetismo interpersonal y plenitud afectiva.",
    emotionalTone: "Amor incondicional, generosidad desbordante y presencia acogedora.",
    superpower: "Comunicación empática, co-creación comunitaria y manifestación fértil.",
    shadowWarning: "Olvidar los propios límites y caer en el agotamiento por complacencia.",
    botany: ["Rosa Damascena", "Flores de Azahar", "Cacao sagrado"],
    ritual: "Baño de inmersión con pétalos de rosa y bendición del corazón ante un espejo.",
    affirmation: "Soy un manantial inagotable de gracia; nutro al mundo mientras me honro a mí misma."
  },
  {
    id: "hechicera",
    name: "La Hechicera",
    phase: "Fase Lútea (Pre-menstrual)",
    lunarPhase: "Luna Menguante 🌘",
    season: "Otoño Interior",
    cycleDays: "Días 18 - 28",
    colorHex: "#A855F7",
    accentColor: "#E11D48",
    glowColor: "rgba(168, 85, 247, 0.4)",
    hzFrequency: 639,
    essence: "Intuición visceral, corte de lazos obsoletos, creatividad indómita y discernimiento.",
    emotionalTone: "Pasión transmutadora, hipersensibilidad mística y verdad sin filtros.",
    superpower: "Detectar falsedades, limpiar energía densa y canalizar arte disruptivo.",
    shadowWarning: "Autocrítica punitiva y arrebatos de frustración reactiva.",
    botany: ["Salvia Blanca", "Cedro del Himalaya", "Aceite de Onagra"],
    ritual: "Quema en fuego de pergamino con decretos de liberación y desapego de cargas ajenas.",
    affirmation: "Honro mi instinto salvaje; transformo cualquier sombra en sabiduría lúcida y poder."
  },
  {
    id: "anciana",
    name: "La Anciana Sabia",
    phase: "Fase Menstrual",
    lunarPhase: "Luna Nueva 🌑",
    season: "Invierno Interior",
    cycleDays: "Días 1 - 5",
    colorHex: "#6366F1",
    accentColor: "#94A3B8",
    glowColor: "rgba(99, 102, 241, 0.4)",
    hzFrequency: 396,
    essence: "Quietud regenerativa, conexión con el Gran Misterio, descanso sagrado y oráculo interno.",
    emotionalTone: "Paz de fondo cósmica, sobriedad espiritual y comunión con los ancestros.",
    superpower: "Visión profética, descanso sanador e integración cuántica del ciclo.",
    shadowWarning: "Aislamiento depresivo o desconexión del cuerpo por estrés.",
    botany: ["Mirra sagrada", "Lavanda francesa", "Manzanilla amarga"],
    ritual: "Reposo consciente en penumbra con manta abrigada y entrega a la quietud del vacío.",
    affirmation: "En el silencio de mi útero y mi alma, descanso en la sabiduría infinita de la Diosa."
  }
];

export function FemaleArchetypesWheel() {
  const [selectedArchetype, setSelectedArchetype] = useState<ArchetypeData>(ARCHETYPES[0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copied, setCopied] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscNodesRef = useRef<{ osc1: OscillatorNode; osc2: OscillatorNode; gain: GainNode } | null>(null);

  const startAudioTone = (hz: number) => {
    stopAudioTone();
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(hz, ctx.currentTime);

      // Ligero batimiento binaural para serenidad (+1.5 Hz)
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(hz + 1.5, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 1.2);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();

      oscNodesRef.current = { osc1, osc2, gain };
      setIsPlayingAudio(true);
    } catch (e) {
      console.warn("Audio Context init error:", e);
    }
  };

  const stopAudioTone = () => {
    if (oscNodesRef.current && audioCtxRef.current) {
      try {
        const { gain, osc1, osc2 } = oscNodesRef.current;
        gain.gain.linearRampToValueAtTime(0.0001, audioCtxRef.current.currentTime + 0.6);
        setTimeout(() => {
          try {
            osc1.stop();
            osc2.stop();
            osc1.disconnect();
            osc2.disconnect();
          } catch (e) {}
        }, 650);
      } catch (e) {}
      oscNodesRef.current = null;
    }
    setIsPlayingAudio(false);
  };

  const handleSelect = (archetype: ArchetypeData) => {
    setSelectedArchetype(archetype);
    if (isPlayingAudio) {
      startAudioTone(archetype.hzFrequency);
    }
  };

  const handleCopyAffirmation = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(selectedArchetype.affirmation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-4 space-y-8 text-[#F8F9FA]">
      {/* Header Sagrado */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-pink-500/30 bg-pink-500/10 text-pink-300 text-xs font-semibold tracking-widest uppercase">
          <Moon size={14} className="text-pink-400" />
          <span>Biociclos & Arquetipos Femeninos</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-sacred font-bold text-white tracking-wide">
          La Rueda de los 4 Arquetipos
        </h2>
        <p className="text-xs sm:text-sm text-stone-300 font-sans">
          Sintoniza con las cuatro estaciones de tu ciclo hormonal y lunar para comprender tus mareas emocionales,
          potenciar tu creatividad y descansar sin culpa.
        </p>
      </div>

      {/* Grid Principal: Rueda Circular + Panel Detallado */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Lado Izquierdo: Mandala Interactivo SVG (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-4">
          <div className="relative w-72 h-72 sm:w-88 sm:h-88 flex items-center justify-center">
            {/* Anillo de Glow */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border border-dashed border-amber-400/20"
            />

            {/* 4 Cuadrantes de los Arquetipos */}
            <svg viewBox="0 0 200 200" className="w-full h-full -rotate-45 transform">
              {ARCHETYPES.map((arch, index) => {
                const isSelected = selectedArchetype.id === arch.id;
                // Calculamos el arco para cada cuadrante (90 grados cada uno)
                const startAngle = index * 90;
                const endAngle = startAngle + 90;
                const r1 = 45; // Radio interior
                const r2 = 92; // Radio exterior

                const toRad = (deg: number) => (deg * Math.PI) / 180;
                const x1 = 100 + r2 * Math.cos(toRad(startAngle));
                const y1 = 100 + r2 * Math.sin(toRad(startAngle));
                const x2 = 100 + r2 * Math.cos(toRad(endAngle));
                const y2 = 100 + r2 * Math.sin(toRad(endAngle));
                const x3 = 100 + r1 * Math.cos(toRad(endAngle));
                const y3 = 100 + r1 * Math.sin(toRad(endAngle));
                const x4 = 100 + r1 * Math.cos(toRad(startAngle));
                const y4 = 100 + r1 * Math.sin(toRad(startAngle));

                const pathData = `M ${x1} ${y1} A ${r2} ${r2} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${r1} ${r1} 0 0 0 ${x4} ${y4} Z`;

                return (
                  <path
                    key={arch.id}
                    d={pathData}
                    fill={arch.colorHex}
                    fillOpacity={isSelected ? 0.75 : 0.25}
                    stroke={isSelected ? "#F5D77F" : arch.colorHex}
                    strokeWidth={isSelected ? 2 : 1}
                    className="cursor-pointer transition-all duration-300 hover:fill-opacity-60"
                    onClick={() => handleSelect(arch)}
                  />
                );
              })}
            </svg>

            {/* Centro Sagrado: Fase Lunar & Toggle de Sonido */}
            <div className="absolute inset-0 m-auto w-24 h-24 rounded-full bg-[#140D07]/90 border border-amber-400/40 backdrop-blur-md flex flex-col items-center justify-center p-2 text-center shadow-2xl">
              <span className="text-[10px] uppercase font-mono tracking-wider text-amber-300">
                {selectedArchetype.lunarPhase.split(" ")[0]}
              </span>
              <span className="text-xl">
                {selectedArchetype.lunarPhase.split(" ")[1] || "🌕"}
              </span>
              <span className="text-[9px] font-sans text-stone-400 truncate max-w-[70px]">
                {selectedArchetype.season}
              </span>
            </div>
          </div>

          {/* Selector Rápido de Cuadrante */}
          <div className="grid grid-cols-2 gap-2 w-full max-w-xs mt-6">
            {ARCHETYPES.map((arch) => {
              const isSelected = selectedArchetype.id === arch.id;
              return (
                <button
                  key={arch.id}
                  onClick={() => handleSelect(arch)}
                  className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-all flex items-center gap-1.5 justify-center cursor-pointer ${
                    isSelected
                      ? "border-amber-400 bg-amber-400/20 text-amber-200 shadow-md scale-102"
                      : "border-white/10 bg-white/5 text-stone-300 hover:border-white/20"
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: arch.colorHex }}
                  />
                  <span className="truncate">{arch.name}</span>
                </button>
              );
            })}
          </div>

          {/* Botón de Sintonía Sonora */}
          <button
            onClick={() => {
              if (isPlayingAudio) stopAudioTone();
              else startAudioTone(selectedArchetype.hzFrequency);
            }}
            className={`mt-4 px-4 py-2 rounded-full border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              isPlayingAudio
                ? "border-pink-400 bg-pink-500/20 text-pink-200 shadow-[0_0_20px_rgba(244,114,182,0.4)] animate-pulse"
                : "border-white/15 bg-white/5 text-stone-300 hover:border-pink-400/40 hover:text-white"
            }`}
          >
            {isPlayingAudio ? <Volume2 size={15} /> : <VolumeX size={15} />}
            <span>Sintonía Armónica ({selectedArchetype.hzFrequency} Hz)</span>
          </button>
        </div>

        {/* Lado Derecho: Ficha Profunda del Arquetipo (7 cols) */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedArchetype.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-gradient-to-b from-[#1A120B]/90 via-[#120C07]/90 to-[#0A0704] shadow-2xl space-y-6"
            >
              {/* Encabezado Ficha */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: selectedArchetype.colorHex }}
                    />
                    <h3 className="text-2xl sm:text-3xl font-sacred font-bold text-white">
                      {selectedArchetype.name}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-pink-300 font-sans mt-0.5">
                    {selectedArchetype.phase} · {selectedArchetype.season}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono px-3 py-1 rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-300">
                    {selectedArchetype.cycleDays}
                  </span>
                  <p className="text-[11px] text-stone-400 mt-1">
                    {selectedArchetype.lunarPhase}
                  </p>
                </div>
              </div>

              {/* Esencia y Tono Emocional */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] space-y-1">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-amber-300 flex items-center gap-1.5">
                    <Sparkles size={13} />
                    Esencia Vital
                  </span>
                  <p className="text-xs text-stone-200 leading-relaxed font-sans">
                    {selectedArchetype.essence}
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] space-y-1">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-pink-300 flex items-center gap-1.5">
                    <Heart size={13} />
                    Tono Emocional
                  </span>
                  <p className="text-xs text-stone-200 leading-relaxed font-sans">
                    {selectedArchetype.emotionalTone}
                  </p>
                </div>
              </div>

              {/* Don & Luz de Sombra */}
              <div className="p-4 rounded-2xl border border-white/[0.08] bg-[#0E0905] space-y-3">
                <div className="flex items-start gap-2.5">
                  <Flame size={16} className="text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-amber-200">
                      Superpoder Arquetípico:
                    </span>
                    <p className="text-xs text-stone-300 font-sans mt-0.5">
                      {selectedArchetype.superpower}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 pt-2 border-t border-white/[0.06]">
                  <Feather size={16} className="text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-rose-300">
                      Guardián de Sombra:
                    </span>
                    <p className="text-xs text-stone-300 font-sans mt-0.5">
                      {selectedArchetype.shadowWarning}
                    </p>
                  </div>
                </div>
              </div>

              {/* Botiquín Herbal & Ritual Sugerido */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-emerald-400 flex items-center gap-1.5">
                    <Flower2 size={13} />
                    Plantas Aliadas
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedArchetype.botany.map((plant, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg border border-emerald-500/25 bg-emerald-500/10 text-emerald-300 text-[11px]"
                      >
                        {plant}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-amber-300 flex items-center gap-1.5">
                    <Compass size={13} />
                    Rito Sugerido
                  </span>
                  <p className="text-xs text-stone-300 leading-relaxed font-sans">
                    {selectedArchetype.ritual}
                  </p>
                </div>
              </div>

              {/* Afirmación Sagrada */}
              <div className="p-4 rounded-2xl border border-amber-400/30 bg-gradient-to-r from-amber-500/10 via-pink-500/10 to-amber-500/10 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-amber-300">
                    Decreto de Poder
                  </span>
                  <p className="text-xs sm:text-sm font-editorial italic text-amber-100">
                    "{selectedArchetype.affirmation}"
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

export default FemaleArchetypesWheel;
