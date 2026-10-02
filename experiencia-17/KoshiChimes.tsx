"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wind,
  Droplets,
  Flame,
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  Disc
} from "lucide-react";

export interface KoshiChimeDef {
  id: string;
  name: string;
  element: "Tierra 🌍" | "Agua 💧" | "Aire 💨" | "Fuego 🔥";
  elementColor: string;
  glowColor: string;
  tuningNotes: string[];
  frequenciesHz: number[];
  bambooHue: string;
  description: string;
  affirmation: string;
}

export const KOSHI_INSTRUMENTS: KoshiChimeDef[] = [
  {
    id: "terra",
    name: "Koshi Terra",
    element: "Tierra 🌍",
    elementColor: "#10B981",
    glowColor: "rgba(16, 185, 129, 0.4)",
    tuningNotes: ["G", "C", "E", "F", "G", "C", "E", "G"],
    frequenciesHz: [392.0, 523.25, 659.25, 698.46, 783.99, 1046.5, 1318.51, 1567.98],
    bambooHue: "#2A2318",
    description: "Afinación profunda de enraizamiento. Calma la mente hiperactiva y ancla la presencia al cuerpo.",
    affirmation: "Estoy seguro y sostenido en la quietud inquebrantable de la Tierra."
  },
  {
    id: "aqua",
    name: "Koshi Aqua",
    element: "Agua 💧",
    elementColor: "#0EA5E9",
    glowColor: "rgba(14, 165, 233, 0.4)",
    tuningNotes: ["A", "D", "F", "G", "A", "D", "F", "A"],
    frequenciesHz: [440.0, 587.33, 698.46, 783.99, 880.0, 1174.66, 1396.91, 1760.0],
    bambooHue: "#1A252E",
    description: "Melodía cristalina de lluvia y manantial. Desbloquea emociones estancadas y restaura la fluidez.",
    affirmation: "Permito que mis sentimientos fluyan libres y transparentes como agua viva."
  },
  {
    id: "aria",
    name: "Koshi Aria",
    element: "Aire 💨",
    elementColor: "#38BDF8",
    glowColor: "rgba(56, 189, 248, 0.4)",
    tuningNotes: ["A", "C", "E", "A", "B", "C", "E", "B"],
    frequenciesHz: [440.0, 523.25, 659.25, 880.0, 987.77, 1046.5, 1318.51, 1975.53],
    bambooHue: "#22252A",
    description: "Susurro etéreo de la brisa en las cumbres montañosas. Aporta ligereza de pensamiento e inspiración.",
    affirmation: "Mi espíritu es libre y ligero como el viento entre las hojas."
  },
  {
    id: "ignis",
    name: "Koshi Ignis",
    element: "Fuego 🔥",
    elementColor: "#F59E0B",
    glowColor: "rgba(245, 158, 11, 0.4)",
    tuningNotes: ["G", "B", "D", "G", "B", "D", "G", "A"],
    frequenciesHz: [392.0, 493.88, 587.33, 783.99, 987.77, 1174.66, 1567.98, 1760.0],
    bambooHue: "#2E1E14",
    description: "Chispa cálida de alegría y fuerza vital. Despierta el entusiasmo creador y la calidez del corazón.",
    affirmation: "Enciendo mi fuego sagrado y actúo con pasión luminosa."
  }
];

export function KoshiChimes() {
  const [activeKoshi, setActiveKoshi] = useState<KoshiChimeDef>(KOSHI_INSTRUMENTS[0]);
  const [isBreezeActive, setIsBreezeActive] = useState(true);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Síntesis acústica de varilla de metal Koshi
  const strikeChimeNote = (freqIndex?: number) => {
    if (isAudioMuted) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = audioCtxRef.current || new AudioCtx();
      audioCtxRef.current = ctx;

      const freqs = activeKoshi.frequenciesHz;
      const freq = freqIndex !== undefined ? freqs[freqIndex % freqs.length] : freqs[Math.floor(Math.random() * freqs.length)];

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.015); // Ataque cristalino
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.2); // Decaimiento largo

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 3.3);
    } catch (e) {}
  };

  // Motor visual en Canvas 2D: badajo oscilante y cilindro de bambú
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 360);
    let height = (canvas.height = 420);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 420;
    };
    window.addEventListener("resize", handleResize);

    const pivotX = width / 2;
    const pivotY = 40;
    const cylinderLength = 160;
    const cylinderWidth = 75;

    let angle = 0;
    let angularVel = 0;
    let clapperAngle = 0;
    let frameCount = 0;

    const render = () => {
      frameCount++;
      ctx.clearRect(0, 0, width, height);

      // Física de brisa ambiental
      if (isBreezeActive) {
        const breezeForce = Math.sin(frameCount * 0.03) * 0.0008 + (Math.random() - 0.5) * 0.001;
        angularVel += breezeForce;

        // Golpe accidental del badajo con las varillas de metal
        if (Math.abs(clapperAngle - angle) > 0.09 && frameCount % 35 === 0) {
          strikeChimeNote();
        }
      }

      // Amortiguamiento
      angularVel *= 0.985;
      angle += angularVel;
      clapperAngle += (angle - clapperAngle) * 0.12;

      // Dibujar suspensión de cordón superior
      ctx.strokeStyle = "#D4AF37";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(pivotX, 0);
      ctx.lineTo(pivotX, pivotY);
      ctx.stroke();

      // Dibujar anillo de bronce superior
      ctx.fillStyle = "#B45309";
      ctx.beginPath();
      ctx.arc(pivotX, pivotY, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.translate(pivotX, pivotY);
      ctx.rotate(angle);

      // Sombra del cilindro
      ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
      ctx.fillRect(-cylinderWidth / 2 + 8, 0, cylinderWidth, cylinderLength);

      // Cilindro de Bambú Koshi
      const bambooGrad = ctx.createLinearGradient(-cylinderWidth / 2, 0, cylinderWidth / 2, 0);
      bambooGrad.addColorStop(0, "#382315");
      bambooGrad.addColorStop(0.3, "#5A3820");
      bambooGrad.addColorStop(0.7, "#784B2B");
      bambooGrad.addColorStop(1, "#26170D");

      ctx.fillStyle = bambooGrad;
      ctx.beginPath();
      ctx.roundRect(-cylinderWidth / 2, 0, cylinderWidth, cylinderLength, [12, 12, 6, 6]);
      ctx.fill();

      // Borde tallado y franja del elemento
      ctx.strokeStyle = activeKoshi.elementColor;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Veta de bambú natural y sello grabado
      ctx.fillStyle = activeKoshi.elementColor;
      ctx.font = "bold 10px Cinzel, serif";
      ctx.textAlign = "center";
      ctx.fillText(activeKoshi.name.toUpperCase(), 0, cylinderLength - 20);

      // Badajo interior de vidrio / madera
      ctx.save();
      ctx.rotate(clapperAngle - angle);

      ctx.strokeStyle = "#E2E8F0";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, 10);
      ctx.lineTo(0, cylinderLength + 50); // Cuelga más allá del cilindro
      ctx.stroke();

      // Disco del badajo que choca con las 8 varillas
      ctx.fillStyle = "#F5D77F";
      ctx.beginPath();
      ctx.arc(0, cylinderLength * 0.55, 12, 0, Math.PI * 2);
      ctx.fill();

      // Péndulo de viento colgante (veleta de vidrio / bambú inferior)
      ctx.fillStyle = activeKoshi.elementColor;
      ctx.beginPath();
      ctx.ellipse(0, cylinderLength + 50, 14, 28, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [activeKoshi, isBreezeActive]);

  // Agitar manualmente la campana
  const handleSwingChime = () => {
    strikeChimeNote();
    // Agitar varias veces seguidas simulando movimiento manual
    setTimeout(() => strikeChimeNote(), 300);
    setTimeout(() => strikeChimeNote(), 650);
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-4 space-y-8 text-[#F8F9FA]">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-300 text-xs font-semibold tracking-widest uppercase">
          <Wind size={14} className="text-sky-400" />
          <span>Acústica Chamánica & Armónicos Elementales</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-sacred font-bold text-white tracking-wide">
          Campanas Koshi Elementales
        </h2>
        <p className="text-xs sm:text-sm text-stone-300 font-sans">
          Cuatro instrumentos eólicos afinados con precisión a los elementos sagrados: Terra, Aqua, Aria e Ignis.
          Agita la campana con tu mano o activa la brisa continua para inducir estados alfa y theta.
        </p>
      </div>

      {/* Grid: Campana en Canvas + Panel de Afinación */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Canvas de la Campana Koshi (6 cols) */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-4 bg-gradient-to-b from-[#10171D]/80 via-[#0A1014]/90 to-[#040608] border border-sky-500/25 rounded-3xl relative overflow-hidden shadow-2xl">
          {/* Resplandor del elemento */}
          <div
            className="absolute inset-0 blur-3xl opacity-20 pointer-events-none transition-all duration-700"
            style={{ backgroundColor: activeKoshi.elementColor }}
          />

          <div className="w-full relative flex justify-center cursor-pointer" onClick={handleSwingChime} title="Toca para tañer las campanas">
            <canvas ref={canvasRef} className="w-full max-w-sm h-[400px]" />
          </div>

          {/* Barra de Controles de la Campana */}
          <div className="w-full max-w-sm mt-2 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs">
            <button
              onClick={handleSwingChime}
              className="px-4 py-2 rounded-full border border-amber-400/40 bg-amber-500/20 text-amber-200 font-semibold flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer"
            >
              <Sparkles size={14} />
              <span>Tañer Campana</span>
            </button>

            <button
              onClick={() => setIsBreezeActive(!isBreezeActive)}
              className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all cursor-pointer ${
                isBreezeActive
                  ? "border-sky-400 bg-sky-500/20 text-sky-200"
                  : "border-white/10 bg-white/5 text-stone-400"
              }`}
            >
              {isBreezeActive ? "Brisa Activa" : "Viento en Calma"}
            </button>

            <button
              onClick={() => setIsAudioMuted(!isAudioMuted)}
              className="p-2 rounded-full border border-white/10 bg-white/5 text-stone-300 hover:text-white cursor-pointer"
            >
              {isAudioMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
          </div>
        </div>

        {/* Panel de los 4 Elementos y Escala Acústica (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Selector de las 4 Campanas */}
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-sky-300 block mb-3">
              Selecciona tu Campana Koshi:
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              {KOSHI_INSTRUMENTS.map((inst) => {
                const isSelected = activeKoshi.id === inst.id;
                return (
                  <button
                    key={inst.id}
                    onClick={() => {
                      setActiveKoshi(inst);
                      strikeChimeNote(0);
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-sky-400 bg-sky-500/20 shadow-[0_0_15px_rgba(56,189,248,0.3)] text-white"
                        : "border-white/10 bg-[#0E151A]/60 text-stone-300 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-sacred font-bold">
                        {inst.name}
                      </span>
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: inst.elementColor }}
                      />
                    </div>
                    <span className="text-[10px] text-stone-400 block mt-1">
                      {inst.element}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ficha de Afinación & Resonancia */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeKoshi.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-6 rounded-3xl border border-white/10 bg-gradient-to-b from-[#111920] to-[#070B0E] space-y-5 shadow-2xl"
            >
              <div className="border-b border-white/10 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-xl sm:text-2xl font-sacred font-bold text-white">
                    {activeKoshi.name}
                  </h3>
                  <span className="text-xs text-sky-300 font-mono">
                    Elemento Sagrado: {activeKoshi.element}
                  </span>
                </div>
              </div>

              {/* Varillas y Notas Musicales */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-300 block">
                  Afinación de las 8 Varillas de Plata:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeKoshi.tuningNotes.map((note, idx) => (
                    <button
                      key={idx}
                      onClick={() => strikeChimeNote(idx)}
                      className="px-3 py-1 rounded-xl border border-white/15 bg-white/5 hover:border-sky-400 hover:bg-sky-500/20 text-xs font-mono font-bold text-white transition-all cursor-pointer"
                      title={`Tocar nota ${note} (${activeKoshi.frequenciesHz[idx]} Hz)`}
                    >
                      {note} <span className="text-[9px] text-stone-400 font-normal">({Math.round(activeKoshi.frequenciesHz[idx])}Hz)</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Descripción */}
              <p className="text-xs text-stone-200 leading-relaxed font-sans p-3.5 rounded-2xl border border-white/[0.08] bg-white/[0.02]">
                {activeKoshi.description}
              </p>

              {/* Afirmación del Elemento */}
              <div className="p-4 rounded-2xl border border-sky-400/30 bg-sky-500/10 space-y-1">
                <span className="text-[10px] uppercase font-mono tracking-widest text-sky-300">
                  Decreto del Elemento
                </span>
                <p className="text-xs sm:text-sm font-editorial italic text-sky-100">
                  "{activeKoshi.affirmation}"
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default KoshiChimes;
