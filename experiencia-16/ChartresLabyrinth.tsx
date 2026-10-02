"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  Footprints
} from "lucide-react";

export type LabyrinthStage = "purgatio" | "illuminatio" | "unitio";

export function ChartresLabyrinth() {
  const [progress, setProgress] = useState(0); // 0 a 100%
  const [isWalking, setIsWalking] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);

  // Determinar la fase espiritual según el avance
  let currentStage: LabyrinthStage = "purgatio";
  if (progress >= 48 && progress <= 55) {
    currentStage = "illuminatio";
  } else if (progress > 55) {
    currentStage = "unitio";
  }

  const playHarpNote = () => {
    if (isAudioMuted) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = audioCtxRef.current || new AudioCtx();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const notes = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25];
      const note = notes[Math.floor(Math.random() * notes.length)];

      osc.type = "sine";
      osc.frequency.setValueAtTime(note, ctx.currentTime);

      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.8);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.9);
    } catch (e) {}
  };

  // Caminata automática del peregrino
  useEffect(() => {
    if (!isWalking) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setIsWalking(false);
          return 100;
        }
        if (prev % 8 === 0) playHarpNote();
        return prev + 1;
      });
    }, 280);

    return () => clearInterval(interval);
  }, [isWalking]);

  const handleReset = () => {
    setIsWalking(false);
    setProgress(0);
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-4 space-y-8 text-[#F8F9FA]">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-semibold tracking-widest uppercase">
          <Footprints size={14} className="text-amber-400" />
          <span>Peregrinaje Interior & Camino Unicursal</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-sacred font-bold text-white tracking-wide">
          Laberinto Sagrado de Meditación
        </h2>
        <p className="text-xs sm:text-sm text-stone-300 font-sans">
          Inspirado en el laberinto de la Catedral de Chartres (siglo XIII).
          No hay caminos falsos ni pérdidas: un solo sendero sagrado te guía al centro de tu propio ser.
        </p>
      </div>

      {/* Grid: Laberinto SVG + Panel de las Tres Fases */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Laberinto SVG (6 cols) */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-4 bg-gradient-to-b from-[#181105]/80 via-[#100A03]/90 to-[#050301] border border-amber-500/25 rounded-3xl relative overflow-hidden shadow-2xl">
          <div className="relative w-72 h-72 sm:w-96 sm:h-96 flex items-center justify-center select-none">
            {/* Anillos concéntricos del Laberinto de Chartres */}
            <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_15px_rgba(212,175,55,0.25)]">
              {/* 11 Circuitos sagrados */}
              {[90, 82, 74, 66, 58, 50, 42, 34, 26, 18].map((r, i) => (
                <circle
                  key={i}
                  cx={100}
                  cy={100}
                  r={r}
                  fill="none"
                  stroke={i % 2 === 0 ? "#78350F" : "#D4AF37"}
                  strokeWidth={1.2}
                  strokeOpacity={0.6}
                  strokeDasharray={i % 3 === 0 ? "4 2" : "none"}
                />
              ))}

              {/* Centro: Rosa Mística de 6 Pétalos */}
              <circle cx={100} cy={100} r={12} fill="#B45309" stroke="#F5D77F" strokeWidth={1.5} />
              {[0, 60, 120, 180, 240, 300].map((deg) => {
                const rad = (deg * Math.PI) / 180;
                return (
                  <circle
                    key={deg}
                    cx={100 + Math.cos(rad) * 6}
                    cy={100 + Math.sin(rad) * 6}
                    r={3}
                    fill="#F5D77F"
                  />
                );
              })}

              {/* El Peregrino (Luz viajera en el sendero) */}
              <g>
                <circle
                  cx={100 + Math.cos((progress * 3.6 * Math.PI) / 180) * (85 - (progress * 0.7))}
                  cy={100 + Math.sin((progress * 3.6 * Math.PI) / 180) * (85 - (progress * 0.7))}
                  r={5}
                  fill="#F5D77F"
                  className="animate-pulse"
                />
                <circle
                  cx={100 + Math.cos((progress * 3.6 * Math.PI) / 180) * (85 - (progress * 0.7))}
                  cy={100 + Math.sin((progress * 3.6 * Math.PI) / 180) * (85 - (progress * 0.7))}
                  r={10}
                  fill="none"
                  stroke="#F5D77F"
                  strokeWidth={0.8}
                  strokeOpacity={0.5}
                />
              </g>
            </svg>

            {/* Etiqueta de Progreso en el Centro */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full border border-amber-400/30 bg-[#140D06]/90 backdrop-blur-md text-xs font-mono text-amber-300">
              Sendero: {progress}%
            </div>
          </div>

          {/* Barra de Controles de la Caminata */}
          <div className="w-full max-w-sm mt-3 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs">
            <button
              onClick={() => setIsWalking(!isWalking)}
              className={`px-4 py-2 rounded-full border font-semibold flex items-center gap-1.5 transition-all shadow-md cursor-pointer ${
                isWalking
                  ? "border-amber-400 bg-amber-400/20 text-amber-200"
                  : "border-amber-400 bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:scale-105"
              }`}
            >
              {isWalking ? <Pause size={14} /> : <Play size={14} />}
              <span>{isWalking ? "Pausar Pasos" : "Caminar al Centro"}</span>
            </button>

            <button
              onClick={handleReset}
              className="p-2 rounded-full border border-white/10 bg-white/5 text-stone-400 hover:text-white transition-all cursor-pointer"
              title="Volver a la entrada"
            >
              <RotateCcw size={14} />
            </button>

            <button
              onClick={() => setIsAudioMuted(!isAudioMuted)}
              className="p-2 rounded-full border border-white/10 bg-white/5 text-stone-300 hover:text-white cursor-pointer"
            >
              {isAudioMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
          </div>
        </div>

        {/* Panel de las Tres Fases Espirituales (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Fases */}
          <div className="space-y-3">
            {[
              {
                id: "purgatio",
                name: "1. Purgatio (El Soltar / Camino Hacia Adentro)",
                range: "0% - 48%",
                desc: "Descarga las cargas del mundo exterior, las culpas, las agendas y los juicios a cada paso que das.",
                color: "#F59E0B"
              },
              {
                id: "illuminatio",
                name: "2. Illuminatio (La Rosa Central / Recepción)",
                range: "48% - 55%",
                desc: "Descanso en el centro sagrado. Guarda silencio, abre los brazos y recibe la gracia de tu corazón.",
                color: "#EC4899"
              },
              {
                id: "unitio",
                name: "3. Unitio (La Integración / Retorno al Mundo)",
                range: "56% - 100%",
                desc: "Emprende el camino de regreso llevando la sabiduría y la serenidad a tu vida cotidiana.",
                color: "#10B981"
              }
            ].map((f) => {
              const isCurrent = currentStage === f.id;
              return (
                <div
                  key={f.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isCurrent
                      ? "border-amber-400 bg-amber-400/15 shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                      : "border-white/10 bg-[#120C06]/60 opacity-70"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-sacred font-bold text-white">
                      {f.name}
                    </h4>
                    <span className="text-[10px] font-mono text-amber-300">
                      {f.range}
                    </span>
                  </div>
                  <p className="text-xs text-stone-300 font-sans mt-1.5 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Decreto del Peregrino */}
          <div className="p-4 rounded-2xl border border-amber-400/30 bg-amber-500/10 space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-widest text-amber-300">
              Decreto de la Rosa Central
            </span>
            <p className="text-xs sm:text-sm font-editorial italic text-amber-100">
              "No hay prisa en el camino del alma; cada vuelta del laberinto me acerca a mi verdad."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChartresLabyrinth;
