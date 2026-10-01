"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Compass,
  Disc,
  Heart,
  Droplet,
  Waves,
  Wind,
  ShieldCheck,
  RotateCw
} from "lucide-react";

export interface TibetanBowl {
  id: string;
  name: string;
  sanskrit: string;
  chakra: string;
  note: string;
  fundamentalHz: number;
  partial1Ratio: number;
  partial2Ratio: number;
  beatDeltaHz: number; // Pulsación de batimiento binaural acústico (wa-wa-wa)
  colorHex: string;
  glowHex: string;
  diameterCm: number;
  mantra: string;
  intention: string;
}

export const TIBETAN_BOWLS_DATA: TibetanBowl[] = [
  {
    id: "raiz",
    name: "Cuenco Raíz de Tierra",
    sanskrit: "Muladhara",
    chakra: "Chakra Raíz",
    note: "Do (C)",
    fundamentalHz: 194.18,
    partial1Ratio: 2.76,
    partial2Ratio: 5.4,
    beatDeltaHz: 2.2,
    colorHex: "#B83A2E",
    glowHex: "rgba(184, 58, 46, 0.5)",
    diameterCm: 32,
    mantra: "LAM",
    intention: "Arraigo, solidez y liberación profunda de miedos ancestrales."
  },
  {
    id: "sacro",
    name: "Cuenco Sacro de las Aguas",
    sanskrit: "Svadhisthana",
    chakra: "Chakra Sacro",
    note: "Re (D)",
    fundamentalHz: 210.42,
    partial1Ratio: 2.78,
    partial2Ratio: 5.35,
    beatDeltaHz: 2.6,
    colorHex: "#D97706",
    glowHex: "rgba(217, 119, 6, 0.5)",
    diameterCm: 30,
    mantra: "VAM",
    intention: "Fluidez creadora, transmutación emocional y vitalidad sensorial."
  },
  {
    id: "solar",
    name: "Cuenco Solar del Fuego Sagrado",
    sanskrit: "Manipura",
    chakra: "Plexo Solar",
    note: "Mi (E)",
    fundamentalHz: 256.0,
    partial1Ratio: 2.75,
    partial2Ratio: 5.42,
    beatDeltaHz: 3.1,
    colorHex: "#EAB308",
    glowHex: "rgba(234, 179, 8, 0.55)",
    diameterCm: 28,
    mantra: "RAM",
    intention: "Poder personal sereno, claridad de propósito y fuego alquímico."
  },
  {
    id: "corazon",
    name: "Cuenco del Corazón Cósmico (OM)",
    sanskrit: "Anahata",
    chakra: "Chakra Corazón",
    note: "Fa (F) · Frecuencia OM",
    fundamentalHz: 288.0,
    partial1Ratio: 2.74,
    partial2Ratio: 5.38,
    beatDeltaHz: 3.5,
    colorHex: "#10B981",
    glowHex: "rgba(16, 185, 129, 0.55)",
    diameterCm: 26,
    mantra: "YAM",
    intention: "Amor incondicional, perdón puro y paz que sobrepasa el entendimiento."
  },
  {
    id: "garganta",
    name: "Cuenco de la Verdad Cristalina",
    sanskrit: "Vishuddha",
    chakra: "Chakra Garganta",
    note: "Sol (G)",
    fundamentalHz: 341.3,
    partial1Ratio: 2.76,
    partial2Ratio: 5.44,
    beatDeltaHz: 4.1,
    colorHex: "#06B6D4",
    glowHex: "rgba(6, 182, 212, 0.5)",
    diameterCm: 24,
    mantra: "HAM",
    intention: "Expresión impecable, alineación con la palabra sagrada y verdad."
  },
  {
    id: "tercer-ojo",
    name: "Cuenco del Ojo Iluminado",
    sanskrit: "Ajna",
    chakra: "Chakra Tercer Ojo",
    note: "La (A) · 432 Hz Master",
    fundamentalHz: 432.0,
    partial1Ratio: 2.75,
    partial2Ratio: 5.41,
    beatDeltaHz: 4.8,
    colorHex: "#8B5CF6",
    glowHex: "rgba(139, 92, 246, 0.55)",
    diameterCm: 22,
    mantra: "KSHAM",
    intention: "Clarividencia espiritual, serenidad mental y disolución de la ilusión."
  },
  {
    id: "corona",
    name: "Cuenco Corona de Luz Dorada",
    sanskrit: "Sahasrara",
    chakra: "Chakra Corona",
    note: "Si (B) · 528 Hz Milagro",
    fundamentalHz: 528.0,
    partial1Ratio: 2.77,
    partial2Ratio: 5.46,
    beatDeltaHz: 5.2,
    colorHex: "#F59E0B",
    glowHex: "rgba(245, 158, 11, 0.6)",
    diameterCm: 20,
    mantra: "AUM",
    intention: "Unidad cósmica con la Fuente Suprema y beatitud eterna."
  }
];

export function TibetanBowlsSanctuary() {
  const [selectedBowl, setSelectedBowl] = useState<TibetanBowl>(TIBETAN_BOWLS_DATA[3]); // Corazón por defecto
  const [isSinging, setIsSinging] = useState<boolean>(false);
  const [vibrationIntensity, setVibrationIntensity] = useState<number>(0);
  const [isSoundBathActive, setIsSoundBathActive] = useState<boolean>(false);
  const [soundBathIdx, setSoundBathIdx] = useState<number>(0);
  const [breathingPhase, setBreathingPhase] = useState<string>("Inhala");
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const activeNodesRef = useRef<{ [key: string]: { osc1: OscillatorNode; osc2: OscillatorNode; oscPartial: OscillatorNode; gain: GainNode } }>({});
  const frictionGainRef = useRef<GainNode | null>(null);
  const frictionOscRef = useRef<OscillatorNode | null>(null);
  const frictionOsc2Ref = useRef<OscillatorNode | null>(null);
  const soundBathTimerRef = useRef<any>(null);

  // Inicialización de Web Audio al cargar
  const ensureAudioCtx = () => {
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioContextClass();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume().catch(() => {});
    }
    return audioCtxRef.current;
  };

  // Respiración Somática
  useEffect(() => {
    let t: any;
    let idx = 0;
    const phases = [
      { text: "Inhala Paz", dur: 4500 },
      { text: "Sostén la Vibración", dur: 3500 },
      { text: "Exhala y Suelta", dur: 5500 },
      { text: "Vacío Sereno", dur: 2500 }
    ];
    const step = () => {
      setBreathingPhase(phases[idx].text);
      t = setTimeout(() => {
        idx = (idx + 1) % phases.length;
        step();
      }, phases[idx].dur);
    };
    step();
    return () => clearTimeout(t);
  }, []);

  // ============================================================
  // GOLPE DE MAZO AFELPADO (STRIKE CON DECAIMIENTO NATURAL)
  // ============================================================
  const strikeBowl = useCallback((bowl: TibetanBowl, strikeForce: number = 0.8) => {
    if (isMuted) return;
    const ctx = ensureAudioCtx();
    const now = ctx.currentTime;

    const f0 = bowl.fundamentalHz;
    const f1 = f0 * bowl.partial1Ratio;
    const f2 = f0 + bowl.beatDeltaHz; // Ondulación acústica (wa-wa-wa)

    // Master Gain de esta resonancia
    const bowlGain = ctx.createGain();
    const duration = 12.0; // Resonancia larga de 12 segundos

    // Volumen suave y tenue
    const maxVol = Math.min(Math.max(strikeForce * 0.12, 0.04), 0.14);
    bowlGain.gain.setValueAtTime(0.0001, now);
    bowlGain.gain.linearRampToValueAtTime(maxVol, now + 0.018); // Ataque afelpado de mazo
    bowlGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    // Filtro cálido de bronce forjado
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1400, now);
    filter.frequency.exponentialRampToValueAtTime(600, now + duration);

    // Oscilador Principal
    const osc1 = ctx.createOscillator();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(f0, now);

    // Oscilador de Batimiento (Crea el pulso binaural orgánico)
    const osc2 = ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(f2, now);

    // Parcial Armónico Sutil (Campanilla de bronce)
    const oscPartial = ctx.createOscillator();
    oscPartial.type = "sine";
    oscPartial.frequency.setValueAtTime(f1, now);
    const partialGain = ctx.createGain();
    partialGain.gain.setValueAtTime(0.22, now);
    partialGain.gain.exponentialRampToValueAtTime(0.001, now + 5.0); // El parcial armónico decae más rápido

    osc1.connect(filter);
    osc2.connect(filter);
    oscPartial.connect(partialGain);
    partialGain.connect(filter);

    filter.connect(bowlGain);
    bowlGain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    oscPartial.start(now);

    osc1.stop(now + duration + 0.1);
    osc2.stop(now + duration + 0.1);
    oscPartial.stop(now + duration + 0.1);

    // Efecto visual de vibración
    setVibrationIntensity(1.0);
    setSelectedBowl(bowl);
  }, [isMuted]);

  // ============================================================
  // BORDE CANTADO POR FRICCIÓN (SINGING RIM MODE)
  // ============================================================
  const startSingingRim = useCallback((bowl: TibetanBowl) => {
    if (isMuted) return;
    const ctx = ensureAudioCtx();
    const now = ctx.currentTime;

    if (!frictionOscRef.current) {
      const f0 = bowl.fundamentalHz;

      const osc1 = ctx.createOscillator();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(f0, now);

      const osc2 = ctx.createOscillator();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(f0 + bowl.beatDeltaHz, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.09, now + 1.2); // Crecimiento armónico gradual

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(800, now);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);

      frictionOscRef.current = osc1;
      frictionOsc2Ref.current = osc2;
      frictionGainRef.current = gain;
      setIsSinging(true);
    }
  }, [isMuted]);

  const stopSingingRim = useCallback(() => {
    setIsSinging(false);
    if (frictionGainRef.current && audioCtxRef.current) {
      const now = audioCtxRef.current.currentTime;
      const gainToFade = frictionGainRef.current;
      const osc1ToStop = frictionOscRef.current;
      const osc2ToStop = frictionOsc2Ref.current;
      frictionGainRef.current = null;
      frictionOscRef.current = null;
      frictionOsc2Ref.current = null;

      gainToFade.gain.linearRampToValueAtTime(0.0001, now + 1.8);
      setTimeout(() => {
        try {
          if (osc1ToStop) {
            osc1ToStop.stop();
            osc1ToStop.disconnect();
          }
          if (osc2ToStop) {
            osc2ToStop.stop();
            osc2ToStop.disconnect();
          }
          gainToFade.disconnect();
        } catch (e) {}
      }, 1900);
    }
  }, []);

  // Manejo de pulsación en el canvas (Toque corto: golpe con mazo; Mantener presionado: cantar borde)
  const pointerDownTimerRef = useRef<number | null>(null);
  const isHoldingRef = useRef<boolean>(false);

  const handleCanvasPointerDown = () => {
    isHoldingRef.current = false;
    pointerDownTimerRef.current = window.setTimeout(() => {
      isHoldingRef.current = true;
      startSingingRim(selectedBowl);
    }, 240);
  };

  const handleCanvasPointerUp = () => {
    if (pointerDownTimerRef.current) {
      clearTimeout(pointerDownTimerRef.current);
      pointerDownTimerRef.current = null;
    }
    if (isHoldingRef.current) {
      stopSingingRim();
      isHoldingRef.current = false;
    } else {
      strikeBowl(selectedBowl, 0.85);
    }
  };

  const handleCanvasPointerLeave = () => {
    if (pointerDownTimerRef.current) {
      clearTimeout(pointerDownTimerRef.current);
      pointerDownTimerRef.current = null;
    }
    if (isHoldingRef.current) {
      stopSingingRim();
      isHoldingRef.current = false;
    }
  };

  // Baño Sonoro Automático (Secuencia Sagrada)
  const toggleSoundBath = () => {
    if (isSoundBathActive) {
      clearInterval(soundBathTimerRef.current);
      setIsSoundBathActive(false);
    } else {
      setIsSoundBathActive(true);
      let idx = 0;
      strikeBowl(TIBETAN_BOWLS_DATA[idx], 0.7);
      soundBathTimerRef.current = setInterval(() => {
        idx = (idx + 1) % TIBETAN_BOWLS_DATA.length;
        setSoundBathIdx(idx);
        strikeBowl(TIBETAN_BOWLS_DATA[idx], 0.7);
      }, 7000);
    }
  };

  useEffect(() => {
    return () => {
      if (soundBathTimerRef.current) clearInterval(soundBathTimerRef.current);
    };
  }, []);

  // Decaimiento visual de la vibración
  useEffect(() => {
    let anim: number;
    const step = () => {
      setVibrationIntensity((prev) => Math.max(0, prev - 0.006));
      anim = requestAnimationFrame(step);
    };
    anim = requestAnimationFrame(step);
    return () => cancelAnimationFrame(anim);
  }, []);

  // ============================================================
  // VISUALIZADOR CIMÁTICO EN CANVAS 2D (AGUA EN EL CUENCO)
  // ============================================================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const render = () => {
      t += 0.03;
      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;
      const bowlRadius = Math.min(cx, cy) - 22;

      ctx.clearRect(0, 0, width, height);

      // Sombra exterior profunda
      ctx.save();
      ctx.shadowColor = "rgba(0, 0, 0, 0.9)";
      ctx.shadowBlur = 40;

      // 1. Cuerpo del Cuenco (Bronce Forjado a Mano con Grabados)
      const bronzeGrad = ctx.createRadialGradient(cx, cy, bowlRadius * 0.65, cx, cy, bowlRadius + 15);
      bronzeGrad.addColorStop(0, "#2B1B0E");
      bronzeGrad.addColorStop(0.5, "#5A3815");
      bronzeGrad.addColorStop(0.85, "#8B5A2B");
      bronzeGrad.addColorStop(0.95, "#C29B38");
      bronzeGrad.addColorStop(1, "#E5C158");

      ctx.beginPath();
      ctx.arc(cx, cy, bowlRadius + 8, 0, Math.PI * 2);
      ctx.fillStyle = bronzeGrad;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Borde exterior martillado con textura
      ctx.strokeStyle = "rgba(245, 215, 127, 0.7)";
      ctx.lineWidth = 4;
      ctx.stroke();

      // Borde interior fino dorado
      ctx.beginPath();
      ctx.arc(cx, cy, bowlRadius - 2, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(184, 134, 11, 0.5)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // 2. Interior con Agua Sagrada
      const waterGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, bowlRadius - 6);
      waterGrad.addColorStop(0, selectedBowl.glowHex);
      waterGrad.addColorStop(0.35, "rgba(28, 20, 11, 0.85)");
      waterGrad.addColorStop(0.85, "rgba(15, 10, 5, 0.98)");
      waterGrad.addColorStop(1, "#0A0603");

      ctx.beginPath();
      ctx.arc(cx, cy, bowlRadius - 6, 0, Math.PI * 2);
      ctx.fillStyle = waterGrad;
      ctx.fill();

      // 3. Ondas Cimáticas y Ondulaciones en Agua
      const activeAmp = Math.max(vibrationIntensity, isSinging ? 0.8 : 0.15);
      const numWaves = 6;
      for (let w = 1; w <= numWaves; w++) {
        const rBase = ((bowlRadius - 15) / (numWaves + 1)) * w;
        ctx.beginPath();
        const steps = 120;
        for (let i = 0; i <= steps; i++) {
          const theta = (i / steps) * Math.PI * 2;
          // Ondas de Faraday en cuenco tibetano
          const waveDeform = Math.sin(theta * 4 + t * 2) * (5 * activeAmp) + Math.cos(theta * 8 - t) * (3 * activeAmp);
          const r = rBase + waveDeform;
          const px = cx + Math.cos(theta) * r;
          const py = cy + Math.sin(theta) * r;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.strokeStyle = `rgba(245, 215, 127, ${0.1 + (w / numWaves) * 0.25 * activeAmp})`;
        ctx.lineWidth = w % 2 === 0 ? 1.5 : 0.8;
        ctx.stroke();
      }

      // 4. Mantra Tibetano Central Brillante
      const centerPulse = Math.sin(t * 2) * 4 * activeAmp;
      ctx.fillStyle = selectedBowl.colorHex;
      ctx.font = "bold 28px 'Cinzel', serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = selectedBowl.colorHex;
      ctx.shadowBlur = 15 * activeAmp;
      ctx.fillText(selectedBowl.mantra, cx, cy + centerPulse);
      ctx.shadowBlur = 0;

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [selectedBowl, vibrationIntensity, isSinging]);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-10">
      {/* Título y Presentación */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs tracking-widest uppercase font-semibold">
          <Sparkles size={14} className="animate-pulse" />
          <span>Experiencia 18 · Santuario de Cuencos Tibetanos</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-sacred font-bold text-white tracking-wide">
          Resonancia de 7 Metales Sagrados
        </h2>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-stone-300 font-sans leading-relaxed">
          Toca o haz cantar cada cuenco artesanal forjado a mano. Las ondas armónicas armonizan tu campo electromagnético, alinean los 7 chakras y disuelven la tensión mental.
        </p>
      </div>

      {/* Grid Principal: Cuenco Central + Controles Sagrados */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Columna Izquierda: Visualizador del Cuenco Central */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="relative w-full aspect-square max-w-[460px] p-4 flex items-center justify-center">
            {/* Halo de Resonancia */}
            <div
              className="absolute inset-0 rounded-full blur-3xl opacity-35 transition-all duration-1000 -z-10"
              style={{ backgroundColor: selectedBowl.colorHex }}
            />

            {/* Canvas Interactivo del Cuenco */}
            <canvas
              ref={canvasRef}
              width={420}
              height={420}
              onPointerDown={handleCanvasPointerDown}
              onPointerUp={handleCanvasPointerUp}
              onPointerLeave={handleCanvasPointerLeave}
              className="w-full h-full cursor-pointer touch-none filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]"
              title="Toca para golpear con el mazo, o mantén presionado para hacerlo cantar"
            />
          </div>

          {/* Indicaciones de Interacción Táctil */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-2 text-xs text-stone-300">
            <button
              onClick={() => strikeBowl(selectedBowl, 0.85)}
              className="px-4 py-2 rounded-full border border-amber-500/40 bg-gradient-to-r from-amber-600/30 to-amber-700/20 text-amber-200 hover:border-amber-400 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Disc size={15} className="text-amber-400" />
              <span>Golpear con Mazo Afelpado</span>
            </button>

            <button
              onPointerDown={() => startSingingRim(selectedBowl)}
              onPointerUp={stopSingingRim}
              onPointerLeave={stopSingingRim}
              className={`px-4 py-2 rounded-full border text-xs transition-all flex items-center gap-2 cursor-pointer ${
                isSinging
                  ? "border-amber-400 bg-amber-400/25 text-amber-100 shadow-[0_0_20px_rgba(245,215,127,0.5)]"
                  : "border-white/15 bg-white/5 text-stone-300 hover:border-amber-400/40 hover:text-white"
              }`}
            >
              <RotateCw size={15} className={isSinging ? "animate-spin text-amber-300" : ""} />
              <span>Mantén para Cantar Borde</span>
            </button>

            <button
              onClick={toggleSoundBath}
              className={`px-4 py-2 rounded-full border text-xs transition-all flex items-center gap-2 cursor-pointer ${
                isSoundBathActive
                  ? "border-emerald-400 bg-emerald-500/20 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                  : "border-white/15 bg-white/5 text-stone-300 hover:text-white"
              }`}
            >
              {isSoundBathActive ? <Pause size={15} /> : <Play size={15} />}
              <span>{isSoundBathActive ? "Pausar Baño Sonoro" : "Iniciar Baño Sonoro"}</span>
            </button>
          </div>

          {/* Pauta de Respiración */}
          <div className="mt-4 px-4 py-1.5 rounded-full border border-white/10 bg-[#1A1108]/70 backdrop-blur-md text-xs text-amber-200/90 flex items-center gap-2">
            <Wind size={14} className="text-amber-400 animate-pulse" />
            <span>Respiración Guiada: <strong>{breathingPhase}</strong></span>
          </div>
        </div>

        {/* Columna Derecha: Selección de los 7 Cuencos y Sabiduría */}
        <div className="lg:col-span-5 space-y-6">
          {/* Selector de los 7 Cuencos */}
          <div className="p-6 rounded-3xl border border-white/10 bg-[#1C140B]/80 backdrop-blur-xl shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="text-lg font-sacred font-bold text-white flex items-center gap-2">
                <Disc size={18} className="text-amber-400" />
                Los 7 Cuencos Tibetanos
              </h3>
              <span className="text-xs text-amber-300/80 font-mono">7 Centros Vitales</span>
            </div>

            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
              {TIBETAN_BOWLS_DATA.map((bowl) => {
                const isSelected = selectedBowl.id === bowl.id;
                return (
                  <button
                    key={bowl.id}
                    onClick={() => strikeBowl(bowl, 0.8)}
                    className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between group cursor-pointer ${
                      isSelected
                        ? "border-amber-400/80 bg-amber-400/15 shadow-[0_0_20px_rgba(212,175,55,0.25)]"
                        : "border-white/5 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center font-sacred font-bold text-xs shadow-inner"
                        style={{
                          backgroundColor: `${bowl.colorHex}25`,
                          border: `1.5px solid ${bowl.colorHex}`,
                          color: "#FFF"
                        }}
                      >
                        {bowl.mantra}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold font-sacred text-white group-hover:text-amber-300 transition-colors">
                            {bowl.name}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full border border-white/10 text-stone-300 bg-white/5 font-mono">
                            {bowl.fundamentalHz} Hz
                          </span>
                        </div>
                        <p className="text-xs text-stone-400 mt-0.5">
                          {bowl.chakra} · Nota {bowl.note}
                        </p>
                      </div>
                    </div>

                    <div
                      className="w-3 h-3 rounded-full transition-transform group-hover:scale-125"
                      style={{ backgroundColor: bowl.colorHex }}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tarjeta de Intención Espiritual del Cuenco Seleccionado */}
          <div className="p-6 rounded-3xl border border-amber-400/25 bg-gradient-to-b from-[#2B1B0E]/90 to-[#120904]/95 backdrop-blur-2xl shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
                  Mantra Sagrado: {selectedBowl.mantra}
                </span>
                <h4 className="text-xl font-sacred font-bold text-white mt-0.5">
                  {selectedBowl.name}
                </h4>
              </div>
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white shadow-lg"
                style={{ backgroundColor: selectedBowl.colorHex }}
              >
                <Waves size={20} />
              </div>
            </div>

            <p className="text-sm text-stone-300 leading-relaxed font-sans">
              {selectedBowl.intention}
            </p>

            <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs text-amber-200/80">
              <span>Diámetro: <strong>{selectedBowl.diameterCm} cm</strong></span>
              <span>Batimiento Binaural: <strong>~{selectedBowl.beatDeltaHz} Hz</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TibetanBowlsSanctuary;
