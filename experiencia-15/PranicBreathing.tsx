"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wind,
  Sparkles,
  Heart,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  Activity
} from "lucide-react";

export type BreathingPatternId = "coherencia" | "cuadrada" | "478";

export interface BreathingPattern {
  id: BreathingPatternId;
  name: string;
  tagline: string;
  inhale: number;
  holdIn: number;
  exhale: number;
  holdOut: number;
  colorHex: string;
  glowHex: string;
  benefits: string;
}

export const BREATHING_PATTERNS: BreathingPattern[] = [
  {
    id: "coherencia",
    name: "Coherencia Cardíaca 5.5s",
    tagline: "Sincronización Corazón-Cerebro (0.1 Hz)",
    inhale: 5.5,
    holdIn: 0,
    exhale: 5.5,
    holdOut: 0,
    colorHex: "#10B981",
    glowHex: "rgba(16, 185, 129, 0.4)",
    benefits: "Eleva la variabilidad de la frecuencia cardíaca (VFC), equilibra el sistema nervioso autónomo y calma el cortisol."
  },
  {
    id: "cuadrada",
    name: "Respiración Cuadrada (Box Breathing 4-4-4-4)",
    tagline: "Foco Guerrero & Serenidad bajo Presión",
    inhale: 4,
    holdIn: 4,
    exhale: 4,
    holdOut: 4,
    colorHex: "#38BDF8",
    glowHex: "rgba(56, 189, 248, 0.4)",
    benefits: "Anula el pánico inmediato, despeja la niebla mental y brinda estabilidad emocional rápida."
  },
  {
    id: "478",
    name: "Respiración 4-7-8",
    tagline: "Bálsamo del Nervio Vago & Sueño Profundo",
    inhale: 4,
    holdIn: 7,
    exhale: 8,
    holdOut: 0,
    colorHex: "#A855F7",
    glowHex: "rgba(168, 85, 247, 0.4)",
    benefits: "Activa con intensidad el sistema parasimpático, reduce palpitaciones y prepara para el descanso nocturno."
  }
];

export function PranicBreathing() {
  const [activePattern, setActivePattern] = useState<BreathingPattern>(BREATHING_PATTERNS[0]);
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<"Inhala" | "Sostén" | "Exhala" | "Vacío">("Inhala");
  const [cycleCount, setCycleCount] = useState(0);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);

  const playSingingChime = (highPitch = false) => {
    if (isAudioMuted) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = audioCtxRef.current || new AudioCtx();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(highPitch ? 639 : 432, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.07, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 2.6);
    } catch (e) {}
  };

  // Ciclo temporizado de respiración
  useEffect(() => {
    if (!isActive) {
      setCurrentPhase("Inhala");
      return;
    }

    let timeoutId: any;

    const runCycle = () => {
      // 1. Inhalación
      setCurrentPhase("Inhala");
      playSingingChime(true);

      timeoutId = setTimeout(() => {
        // 2. Retención con aire (si aplica)
        if (activePattern.holdIn > 0) {
          setCurrentPhase("Sostén");
          timeoutId = setTimeout(() => {
            startExhale();
          }, activePattern.holdIn * 1000);
        } else {
          startExhale();
        }
      }, activePattern.inhale * 1000);
    };

    const startExhale = () => {
      // 3. Exhalación
      setCurrentPhase("Exhala");
      playSingingChime(false);

      timeoutId = setTimeout(() => {
        // 4. Retención en vacío (si aplica)
        if (activePattern.holdOut > 0) {
          setCurrentPhase("Vacío");
          timeoutId = setTimeout(() => {
            finishCycle();
          }, activePattern.holdOut * 1000);
        } else {
          finishCycle();
        }
      }, activePattern.exhale * 1000);
    };

    const finishCycle = () => {
      setCycleCount((c) => c + 1);
      runCycle();
    };

    runCycle();

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isActive, activePattern]);

  const handleToggleActive = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setCycleCount(0);
    setCurrentPhase("Inhala");
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-4 space-y-8 text-[#F8F9FA]">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs font-semibold tracking-widest uppercase">
          <Wind size={14} className="text-emerald-400" />
          <span>Pranayama & Coherencia Cardíaca</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-sacred font-bold text-white tracking-wide">
          Meditación de Respiración Pránica
        </h2>
        <p className="text-xs sm:text-sm text-stone-300 font-sans">
          Sincroniza tus latidos y tu mente con la esfera de biofeedback visual.
          Regula el sistema nervioso y despierta el flujo de energía vital en tus células.
        </p>
      </div>

      {/* Grid: Esfera Pránica Animada + Panel de Pautas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Esfera Pránica Animada (6 cols) */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#091512]/80 via-[#050D0B]/90 to-[#020504] border border-emerald-500/25 rounded-3xl relative overflow-hidden shadow-2xl min-h-[440px]">
          {/* Glow de la esfera */}
          <div
            className="absolute inset-0 blur-3xl opacity-25 pointer-events-none transition-all duration-700"
            style={{ backgroundColor: activePattern.colorHex }}
          />

          {/* Esfera Geométrica de Respiración */}
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
            {/* Anillos concéntricos de guía */}
            <div className="absolute inset-0 rounded-full border border-dashed border-emerald-500/20" />
            <div className="absolute inset-6 rounded-full border border-emerald-500/10" />

            {/* Esfera animada */}
            <motion.div
              animate={{
                scale:
                  isActive && currentPhase === "Inhala"
                    ? 1.35
                    : isActive && (currentPhase === "Sostén" || currentPhase === "Vacío")
                    ? 1.35
                    : 0.75,
                opacity: currentPhase === "Exhala" ? 0.6 : 0.95
              }}
              transition={{
                duration:
                  currentPhase === "Inhala"
                    ? activePattern.inhale
                    : currentPhase === "Exhala"
                    ? activePattern.exhale
                    : 0.5,
                ease: "easeInOut"
              }}
              className="w-44 h-44 rounded-full flex flex-col items-center justify-center p-4 text-center shadow-2xl relative select-none"
              style={{
                background: `radial-gradient(circle, #FFFFFF 0%, ${activePattern.colorHex} 60%, transparent 100%)`,
                boxShadow: `0 0 50px ${activePattern.glowHex}`
              }}
            >
              <span className="text-xl sm:text-2xl font-sacred font-bold text-stone-900 tracking-wider">
                {isActive ? currentPhase : "Listo"}
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-stone-800 font-semibold mt-1">
                {isActive ? activePattern.name.split(" ")[0] : "Toca Iniciar"}
              </span>
            </motion.div>
          </div>

          {/* Controles de la Práctica */}
          <div className="w-full max-w-sm mt-4 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs">
            <button
              onClick={handleToggleActive}
              className={`px-5 py-2.5 rounded-full border font-semibold flex items-center gap-2 transition-all shadow-md cursor-pointer ${
                isActive
                  ? "border-amber-400 bg-amber-400/20 text-amber-200"
                  : "border-emerald-400 bg-emerald-500/20 text-emerald-200 hover:scale-105"
              }`}
            >
              {isActive ? <Pause size={15} /> : <Play size={15} />}
              <span>{isActive ? "Pausar" : "Iniciar Respiración"}</span>
            </button>

            <button
              onClick={handleReset}
              className="p-2.5 rounded-full border border-white/10 bg-white/5 text-stone-400 hover:text-white transition-all cursor-pointer"
              title="Reiniciar contador"
            >
              <RotateCcw size={15} />
            </button>

            <div className="text-right">
              <span className="text-[11px] text-stone-400 block font-mono">Ciclos:</span>
              <span className="text-sm font-mono font-bold text-emerald-300">{cycleCount}</span>
            </div>

            <button
              onClick={() => setIsAudioMuted(!isAudioMuted)}
              className="p-2.5 rounded-full border border-white/10 bg-white/5 text-stone-300 hover:text-white cursor-pointer"
            >
              {isAudioMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>
          </div>
        </div>

        {/* Panel de Patrones y Beneficios (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Selector de Patrón de Respiración */}
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-emerald-300 block mb-3">
              Selecciona tu Pauta Somática:
            </span>
            <div className="space-y-2.5">
              {BREATHING_PATTERNS.map((p) => {
                const isSelected = activePattern.id === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setActivePattern(p);
                      handleReset();
                    }}
                    className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-emerald-400 bg-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.3)] text-white"
                        : "border-white/10 bg-[#0C1513]/60 text-stone-300 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-sacred font-bold">
                        {p.name}
                      </span>
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: p.colorHex }}
                      />
                    </div>
                    <p className="text-xs text-stone-400 mt-1 font-sans">
                      {p.tagline}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ficha de Impacto Biológico */}
          <div className="p-6 rounded-3xl border border-white/10 bg-[#0B1311] space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-300">
              <Activity size={15} />
              <span>Impacto en la Variabilidad Cardíaca (HRV)</span>
            </div>
            <p className="text-xs text-stone-300 font-sans leading-relaxed">
              {activePattern.benefits}
            </p>
            <div className="pt-2 border-t border-white/[0.06] text-[11px] text-amber-200/80 italic font-editorial">
              "Al inhalar recibes la luz del universo; al exhalar te entregas en perfecta paz."
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PranicBreathing;
