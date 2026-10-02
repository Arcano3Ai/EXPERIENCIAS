"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  Sparkles,
  Volume2,
  VolumeX,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  Activity,
  ShieldCheck,
  Play
} from "lucide-react";

export type PendulumResponse = "si" | "no" | "neutral" | "calibrando";

export interface BovisScaleZone {
  range: string;
  label: string;
  color: string;
  description: string;
}

export const BOVIS_SCALE: BovisScaleZone[] = [
  {
    range: "0 - 4.500 UB",
    label: "Zona Degenerativa / Densidad",
    color: "#EF4444",
    description: "Cansancio crónico, geopatías o lugares cargados negativamente."
  },
  {
    range: "4.500 - 6.500 UB",
    label: "Zona Neutra / Normal",
    color: "#F59E0B",
    description: "Equilibrio biológico estándar sin sobrecarga ni elevación espiritual."
  },
  {
    range: "6.500 - 9.000 UB",
    label: "Zona Óptima de Salud",
    color: "#10B981",
    description: "Vitalidad plena, sistema inmune robusto y mente clara."
  },
  {
    range: "9.000 - 18.000 UB",
    label: "Zona Espiritual / Alta Coherencia",
    color: "#8B5CF6",
    description: "Meditación profunda, lugares sagrados y activación de chakras superiores."
  }
];

export function QuartzPendulum() {
  const [crystalType, setCrystalType] = useState<"cuarzo" | "amatista" | "obsidiana">("cuarzo");
  const [queryText, setQueryText] = useState("");
  const [motionState, setMotionState] = useState<PendulumResponse>("neutral");
  const [bovisReading, setBovisReading] = useState<number>(8500);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playQuartzChime = () => {
    if (isAudioMuted) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = audioCtxRef.current || new AudioCtx();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(crystalType === "amatista" ? 741 : crystalType === "obsidiana" ? 396 : 528, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.07, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 2.6);
    } catch (e) {}
  };

  const askQuestion = (customQ?: string) => {
    const q = customQ || queryText;
    if (!q.trim()) return;

    setMotionState("calibrando");
    playQuartzChime();

    // Simulación de cálculo radiestésico armónico
    setTimeout(() => {
      // Determinación basada en la intención
      const outcomes: PendulumResponse[] = ["si", "si", "no", "si"];
      const chosen = outcomes[Math.floor(Math.random() * outcomes.length)];
      setMotionState(chosen);

      // Lectura Bovis correlacionada
      const newBovis = chosen === "si" ? 8000 + Math.floor(Math.random() * 4000) : 5000 + Math.floor(Math.random() * 2000);
      setBovisReading(newBovis);
    }, 2400);
  };

  // Motor visual de física pendular en Canvas 2D
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 360);
    let height = (canvas.height = 360);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 360;
    };
    window.addEventListener("resize", handleResize);

    const originX = width / 2;
    const originY = 30;
    const stringLength = 170;

    let angle = 0;
    let radius = 10;
    let time = 0;

    const render = () => {
      time += 0.04;
      ctx.clearRect(0, 0, width, height);

      // Determinar trayectoria según el estado radiestésico
      let bobX = originX;
      let bobY = originY + stringLength;

      if (motionState === "si") {
        // Giro horario elíptico
        radius = Math.min(radius + 0.5, 60);
        bobX = originX + Math.cos(time * 2) * radius;
        bobY = originY + stringLength + Math.sin(time * 2) * (radius * 0.45);
      } else if (motionState === "no") {
        // Giro antihorario amplio
        radius = Math.min(radius + 0.5, 60);
        bobX = originX + Math.sin(time * 2) * radius;
        bobY = originY + stringLength + Math.cos(time * 2) * (radius * 0.45);
      } else if (motionState === "calibrando") {
        // Oscilación rápida de búsqueda
        bobX = originX + Math.sin(time * 5) * 20;
        bobY = originY + stringLength;
      } else {
        // Neutral: respiración oscilatoria suave
        radius = 8;
        bobX = originX + Math.sin(time) * 10;
        bobY = originY + stringLength;
      }

      // Dibujar soporte superior de plata
      ctx.fillStyle = "#A8A29E";
      ctx.beginPath();
      ctx.arc(originX, originY, 6, 0, Math.PI * 2);
      ctx.fill();

      // Dibujar cadena de eslabones plateados
      ctx.strokeStyle = "#CBD5E1";
      ctx.lineWidth = 1.2;
      ctx.setLineDash([3, 2]);
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.lineTo(bobX, bobY - 24);
      ctx.stroke();
      ctx.setLineDash([]);

      // Dibujar Cristal de Cuarzo faceteado
      ctx.save();
      ctx.translate(bobX, bobY);

      // Glow del cristal
      const glowGrad = ctx.createRadialGradient(0, 0, 4, 0, 0, 35);
      const glowCol =
        crystalType === "amatista"
          ? "rgba(168, 85, 247, 0.4)"
          : crystalType === "obsidiana"
          ? "rgba(245, 158, 11, 0.25)"
          : "rgba(56, 189, 248, 0.4)";
      glowGrad.addColorStop(0, glowCol);
      glowGrad.addColorStop(1, "transparent");
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(0, 0, 35, 0, Math.PI * 2);
      ctx.fill();

      // Geometría del prisma de cuarzo de 6 facetas
      const crystalGrad = ctx.createLinearGradient(-12, -24, 12, 24);
      if (crystalType === "amatista") {
        crystalGrad.addColorStop(0, "#C084FC");
        crystalGrad.addColorStop(0.5, "#7E22CE");
        crystalGrad.addColorStop(1, "#3B0764");
      } else if (crystalType === "obsidiana") {
        crystalGrad.addColorStop(0, "#44403C");
        crystalGrad.addColorStop(0.5, "#1C1917");
        crystalGrad.addColorStop(1, "#0C0A09");
      } else {
        crystalGrad.addColorStop(0, "#F0F9FF");
        crystalGrad.addColorStop(0.5, "#BAE6FD");
        crystalGrad.addColorStop(1, "#38BDF8");
      }

      ctx.fillStyle = crystalGrad;
      ctx.beginPath();
      ctx.moveTo(0, -22); // Tope
      ctx.lineTo(12, -12);
      ctx.lineTo(10, 10);
      ctx.lineTo(0, 26); // Punta aguda
      ctx.lineTo(-10, 10);
      ctx.lineTo(-12, -12);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [motionState, crystalType]);

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-4 space-y-8 text-[#F8F9FA]">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-300 text-xs font-semibold tracking-widest uppercase">
          <Compass size={14} className="text-teal-400" />
          <span>Radiestesia Cuántica & Bovis</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-sacred font-bold text-white tracking-wide">
          Péndulo Radiestésico de Cuarzo
        </h2>
        <p className="text-xs sm:text-sm text-stone-300 font-sans">
          Calibra tus respuestas a través de la oscilación armónica del péndulo. Consulta la frecuencia de tu campo sutil y el biométrico de Bovis.
        </p>
      </div>

      {/* Grid: Péndulo en Canvas + Consultas Radiestésicas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Canvas del Péndulo (6 cols) */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-4 bg-gradient-to-b from-[#0F171A]/80 via-[#0A1012]/90 to-[#040708] border border-teal-500/25 rounded-3xl relative overflow-hidden shadow-2xl">
          {/* Selector de Cristal */}
          <div className="flex items-center gap-2 mb-2 z-10">
            {[
              { id: "cuarzo", label: "Cuarzo Cristal", col: "#38BDF8" },
              { id: "amatista", label: "Amatista Mística", col: "#A855F7" },
              { id: "obsidiana", label: "Obsidiana Protectora", col: "#F59E0B" }
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => setCrystalType(c.id as any)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                  crystalType === c.id
                    ? "border-teal-400 bg-teal-500/20 text-teal-200"
                    : "border-white/10 bg-white/5 text-stone-400 hover:text-white"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="w-full relative flex justify-center">
            <canvas ref={canvasRef} className="w-full max-w-sm h-[360px]" />
          </div>

          {/* Respuesta Radiestésica Activa */}
          <div className="w-full max-w-sm mt-2 pt-3 border-t border-white/[0.08] flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-400">Respuesta:</span>
              {motionState === "calibrando" ? (
                <span className="text-xs font-mono font-bold text-amber-300 animate-pulse">
                  Sintonizando campo...
                </span>
              ) : motionState === "si" ? (
                <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 size={13} /> SÍ (Giro Horario Positivo)
                </span>
              ) : motionState === "no" ? (
                <span className="text-xs font-mono font-bold text-rose-400">
                  NO (Giro Antihorario)
                </span>
              ) : (
                <span className="text-xs font-mono text-stone-400">
                  En espera (Eje Neutro)
                </span>
              )}
            </div>

            <button
              onClick={() => setIsAudioMuted(!isAudioMuted)}
              className="p-2 rounded-full border border-white/10 bg-white/5 text-stone-300 hover:text-white cursor-pointer"
            >
              {isAudioMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
          </div>
        </div>

        {/* Panel de Consultas y Biómetro de Bovis (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Formulario de Pregunta */}
          <div className="p-6 rounded-3xl border border-white/10 bg-gradient-to-b from-[#131B1E] to-[#090E10] space-y-4 shadow-xl">
            <span className="text-xs uppercase tracking-wider font-semibold text-teal-300 block">
              Haz tu Consulta Radiestésica:
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                placeholder="Ej: ¿Mi energía está en armonía?..."
                className="w-full px-4 py-2.5 rounded-2xl border border-white/15 bg-[#0C1214] text-sm text-white placeholder-stone-500 focus:outline-none focus:border-teal-400 shadow-inner"
              />
              <button
                onClick={() => askQuestion()}
                className="px-5 py-2.5 rounded-2xl border border-teal-400 bg-teal-500/20 text-teal-200 text-xs font-semibold flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all shadow-md shrink-0 cursor-pointer"
              >
                <Play size={14} />
                <span>Testear</span>
              </button>
            </div>

            {/* Preguntas Frecuentes de Calibración */}
            <div className="pt-2">
              <span className="text-[11px] text-stone-400 block mb-2">Preguntas de Calibración Áurica:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "¿Mi cuerpo asimila bien mis alimentos actuales?",
                  "¿Es favorable iniciar este proyecto hoy?",
                  "¿Mi campo áurico está sellado y protegido?",
                  "¿Debo descansar y desconectar pantallas hoy?"
                ].map((q, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setQueryText(q);
                      askQuestion(q);
                    }}
                    className="px-3 py-1 rounded-xl border border-white/10 bg-white/5 text-[11px] text-stone-300 hover:border-teal-400/40 hover:text-teal-200 transition-all cursor-pointer text-left"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Biómetro de Bovis */}
          <div className="p-6 rounded-3xl border border-white/10 bg-[#0E1517] space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Activity size={16} className="text-teal-400" />
                <span className="text-sm font-sacred font-bold text-white">
                  Biómetro de Bovis
                </span>
              </div>
              <span className="text-sm font-mono font-bold text-teal-300 px-3 py-0.5 rounded-full border border-teal-400/30 bg-teal-400/10">
                {bovisReading.toLocaleString()} UB
              </span>
            </div>

            <p className="text-xs text-stone-300 font-sans leading-relaxed">
              Mide la frecuencia biológica vital. La media humana saludable oscila entre 6.500 y 9.000 Unidades Bovis (UB).
            </p>

            <div className="space-y-2">
              {BOVIS_SCALE.map((zone, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: zone.color }}
                    />
                    <span className="font-semibold text-white">{zone.label}</span>
                  </div>
                  <span className="font-mono text-stone-400">{zone.range}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuartzPendulum;
