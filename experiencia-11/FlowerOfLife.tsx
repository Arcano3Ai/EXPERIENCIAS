"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  RotateCcw,
  Volume2,
  VolumeX,
  Compass,
  Sliders,
  Play,
  Pause,
  ShieldCheck,
  Eye
} from "lucide-react";

export type SacredStage = "circulo" | "vesica" | "semilla" | "flor" | "matriz";

export interface StageInfo {
  id: SacredStage;
  name: string;
  circleCount: number;
  significance: string;
  phiRelation: string;
}

export const STAGES_INFO: StageInfo[] = [
  {
    id: "circulo",
    name: "El Círculo Primordial",
    circleCount: 1,
    significance: "La Conciencia Suprema no manifestada, el Punto Cero del que emana toda existencia.",
    phiRelation: "El Uno Cósmico, origen absoluto del radio sagrado."
  },
  {
    id: "vesica",
    name: "La Vesica Piscis",
    circleCount: 2,
    significance: "El desdoblamiento de la Fuente, el útero de la luz donde nace la geometría divina y la proporción raíz de 3.",
    phiRelation: "La relación entre longitud y ancho de la intersección genera la luz."
  },
  {
    id: "semilla",
    name: "La Semilla de la Vida",
    circleCount: 7,
    significance: "Los 7 días de la Creación, los 7 chakras, las 7 notas musicales y los 7 rayos cósmicos.",
    phiRelation: "Estructura hexagonal fractal auto-semejante."
  },
  {
    id: "flor",
    name: "La Flor de la Vida",
    circleCount: 19,
    significance: "El holograma completo de la creación biológica, el patrón atómico de la materia y el ADN.",
    phiRelation: "Contiene todos los 5 Sólidos Platónicos y la Fruta de la Vida."
  },
  {
    id: "matriz",
    name: "Matriz Cósmica Expandida",
    circleCount: 37,
    significance: "La red de conciencia unificada que interconecta todas las galaxias y mentes en un campo cuántico.",
    phiRelation: "Proporción Áurea (Phi = 1.618033...) en expansión infinita."
  }
];

export function FlowerOfLife() {
  const [currentStage, setCurrentStage] = useState<SacredStage>("flor");
  const [colorPalette, setColorPalette] = useState<"oro" | "amatista" | "cian" | "esmeralda">("oro");
  const [isRotating, setIsRotating] = useState(true);
  const [pulseSpeed, setPulseSpeed] = useState(1);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  // Audio continuo afinado a 432 Hz (Frecuencia Pitagórica Áurea)
  useEffect(() => {
    let ctx: AudioContext | null = null;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(432, ctx.currentTime);

      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(isAudioMuted ? 0.0001 : 0.04, ctx.currentTime + 1.5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      oscRef.current = osc;
      gainRef.current = gain;
    } catch (e) {}

    return () => {
      try {
        if (oscRef.current) oscRef.current.stop();
        if (ctx && ctx.state !== "closed") ctx.close().catch(() => {});
      } catch (e) {}
    };
  }, []);

  useEffect(() => {
    if (gainRef.current && audioCtxRef.current) {
      gainRef.current.gain.linearRampToValueAtTime(
        isAudioMuted ? 0.0001 : 0.04,
        audioCtxRef.current.currentTime + 0.3
      );
    }
  }, [isAudioMuted]);

  // Renderizado dinámico de la Flor de la Vida en Canvas 2D
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 400);
    let height = (canvas.height = 420);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 420;
    };
    window.addEventListener("resize", handleResize);

    let angle = 0;
    let pulseTime = 0;

    const render = () => {
      if (isRotating) angle += 0.004 * pulseSpeed;
      pulseTime += 0.02 * pulseSpeed;

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const baseRadius = 45 + Math.sin(pulseTime) * 2; // Respiración sutil

      // Paletas de color
      let strokeStyle = "#F5D77F";
      let glowColor = "rgba(212, 175, 55, 0.4)";
      if (colorPalette === "amatista") {
        strokeStyle = "#C084FC";
        glowColor = "rgba(192, 132, 252, 0.4)";
      } else if (colorPalette === "cian") {
        strokeStyle = "#38BDF8";
        glowColor = "rgba(56, 189, 248, 0.4)";
      } else if (colorPalette === "esmeralda") {
        strokeStyle = "#34D399";
        glowColor = "rgba(52, 211, 153, 0.4)";
      }

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle);

      // Círculo Central Uno
      const drawCircle = (x: number, y: number, r: number) => {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.stroke();
      };

      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = 1.2;
      ctx.shadowBlur = 10;
      ctx.shadowColor = glowColor;

      // Círculo central siempre presente
      drawCircle(0, 0, baseRadius);

      if (currentStage === "vesica" || currentStage === "semilla" || currentStage === "flor" || currentStage === "matriz") {
        // Círculo 2 (Vesica Piscis)
        drawCircle(baseRadius, 0, baseRadius);
      }

      if (currentStage === "semilla" || currentStage === "flor" || currentStage === "matriz") {
        // Semilla: 6 círculos alrededor del centro (ángulos 0, 60, 120, 180, 240, 300)
        for (let i = 0; i < 6; i++) {
          const a = (i * Math.PI) / 3;
          const cx = Math.cos(a) * baseRadius;
          const cy = Math.sin(a) * baseRadius;
          drawCircle(cx, cy, baseRadius);
        }
      }

      if (currentStage === "flor" || currentStage === "matriz") {
        // Flor de la vida: segundo anillo (12 círculos adicionales)
        // 6 a distancia baseRadius * sqrt(3) en ángulos intermedios (30, 90, 150...)
        for (let i = 0; i < 6; i++) {
          const a = (i * Math.PI) / 3 + Math.PI / 6;
          const dist = baseRadius * Math.sqrt(3);
          drawCircle(Math.cos(a) * dist, Math.sin(a) * dist, baseRadius);
        }
        // 6 a distancia 2 * baseRadius en ángulos múltiplos de 60
        for (let i = 0; i < 6; i++) {
          const a = (i * Math.PI) / 3;
          const dist = baseRadius * 2;
          drawCircle(Math.cos(a) * dist, Math.sin(a) * dist, baseRadius);
        }

        // Doble anillo protector sagrado
        ctx.lineWidth = 2;
        drawCircle(0, 0, baseRadius * 3);
        ctx.lineWidth = 1;
        drawCircle(0, 0, baseRadius * 3.08);
      }

      if (currentStage === "matriz") {
        // Círculos del tercer nivel de expansión
        for (let i = 0; i < 18; i++) {
          const a = (i * Math.PI) / 9;
          const dist = baseRadius * 2.8;
          drawCircle(Math.cos(a) * dist, Math.sin(a) * dist, baseRadius);
        }
      }

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [currentStage, colorPalette, isRotating, pulseSpeed]);

  const activeStageInfo = STAGES_INFO.find((s) => s.id === currentStage) || STAGES_INFO[3];

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-4 space-y-8 text-[#F8F9FA]">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-semibold tracking-widest uppercase">
          <Sparkles size={14} className="text-amber-400" />
          <span>Matriz Sagrada & Proporción Áurea</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-sacred font-bold text-white tracking-wide">
          Geometría de la Flor de la Vida
        </h2>
        <p className="text-xs sm:text-sm text-stone-300 font-sans">
          Visualizador fractal de la matemática de la creación afinado al pulso pitagórico de 432 Hz.
          Observa el despliegue del cosmos desde el Punto Cero hasta la Matriz Universal.
        </p>
      </div>

      {/* Grid Principal: Canvas + Controles Sagrados */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Canvas de Geometría Sagrada (6 cols) */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-4 bg-gradient-to-b from-[#181105]/80 via-[#100B03]/90 to-[#070401] border border-amber-500/25 rounded-3xl relative overflow-hidden shadow-2xl">
          <div className="w-full relative flex justify-center">
            <canvas ref={canvasRef} className="w-full max-w-md h-[400px]" />
          </div>

          {/* Barra de Controles en Vivo */}
          <div className="w-full max-w-md mt-2 pt-3 border-t border-white/[0.08] flex items-center justify-between gap-3 text-xs">
            <button
              onClick={() => setIsRotating(!isRotating)}
              className="px-3.5 py-1.5 rounded-full border border-white/10 bg-white/5 text-stone-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
            >
              {isRotating ? <Pause size={13} /> : <Play size={13} />}
              <span>{isRotating ? "Pausar Giro" : "Activar Giro"}</span>
            </button>

            {/* Selector de Paleta de Color */}
            <div className="flex items-center gap-1.5">
              {[
                { id: "oro", color: "#F5D77F" },
                { id: "amatista", color: "#C084FC" },
                { id: "cian", color: "#38BDF8" },
                { id: "esmeralda", color: "#34D399" }
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setColorPalette(p.id as any)}
                  className={`w-5 h-5 rounded-full border transition-all cursor-pointer ${
                    colorPalette === p.id ? "scale-125 border-white shadow-md" : "border-transparent opacity-70"
                  }`}
                  style={{ backgroundColor: p.color }}
                />
              ))}
            </div>

            {/* Toggle de Audio 432 Hz */}
            <button
              onClick={() => setIsAudioMuted(!isAudioMuted)}
              className="p-2 rounded-full border border-white/10 bg-white/5 text-stone-300 hover:text-white cursor-pointer"
              title="Afinación Áurea 432 Hz"
            >
              {isAudioMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
          </div>
        </div>

        {/* Panel de Etapas Sagradas & Filosofía (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Selector de Etapa de Creación */}
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-amber-300 block mb-3">
              Despliegue de la Creación Geométrica:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {STAGES_INFO.map((stage) => {
                const isSelected = currentStage === stage.id;
                return (
                  <button
                    key={stage.id}
                    onClick={() => setCurrentStage(stage.id)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-amber-400 bg-amber-400/20 text-white shadow-[0_0_15px_rgba(212,175,55,0.25)]"
                        : "border-white/10 bg-[#120D04]/60 text-stone-300 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-sacred font-bold">
                        {stage.name}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-amber-300">
                        {stage.circleCount} {stage.circleCount === 1 ? "Círculo" : "Círculos"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ficha Explicativa de la Geometría Activa */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStageInfo.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-6 rounded-3xl border border-white/10 bg-gradient-to-b from-[#181105] to-[#0B0802] space-y-5 shadow-2xl"
            >
              <div className="border-b border-white/10 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-xl sm:text-2xl font-sacred font-bold text-white">
                    {activeStageInfo.name}
                  </h3>
                  <span className="text-xs text-amber-300 font-mono">
                    Geometría Sagrada Universal · 432 Hz
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl border border-white/[0.08] bg-white/[0.02]">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-300 block mb-1">
                    Significado Esotérico
                  </span>
                  <p className="text-xs text-stone-200 leading-relaxed font-sans">
                    {activeStageInfo.significance}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl border border-white/[0.08] bg-white/[0.02]">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-200 block mb-1">
                    Ecuación Cósmica & Proporción Phi (1.618)
                  </span>
                  <p className="text-xs text-stone-300 leading-relaxed font-sans">
                    {activeStageInfo.phiRelation}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-amber-400/30 bg-amber-500/10 space-y-1">
                <span className="text-[10px] uppercase font-mono tracking-widest text-amber-300">
                  Decreto de Activación Celular
                </span>
                <p className="text-xs sm:text-sm font-editorial italic text-amber-100">
                  "Todo mi ser celular se reordena en la divina perfección de la Flor de la Vida."
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default FlowerOfLife;
