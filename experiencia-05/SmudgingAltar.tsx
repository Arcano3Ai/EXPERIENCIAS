"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  Wind,
  Sparkles,
  Volume2,
  VolumeX,
  RotateCcw,
  CheckCircle2,
  Copy,
  Feather,
  ShieldCheck,
  Compass,
  Heart
} from "lucide-react";

export interface HerbResin {
  id: string;
  name: string;
  botanical: string;
  type: "resina" | "hierba" | "madera";
  smokeColor: string;
  glowColor: string;
  purpose: string;
  benefits: string[];
  prayer: string;
  direction: "Este (Aire)" | "Sur (Fuego)" | "Oeste (Agua)" | "Norte (Tierra)" | "Centro (Éter)";
}

export const SACRED_HERBS: HerbResin[] = [
  {
    id: "copal",
    name: "Copal Blanco Sagrado",
    botanical: "Bursera bipinnata",
    type: "resina",
    smokeColor: "rgba(255, 250, 240, 0.45)",
    glowColor: "#F5D77F",
    purpose: "Purificación suprema del éter, consagración divina y elevación de plegarias a los cielos.",
    benefits: [
      "Disuelve negatividad acumulada en habitaciones",
      "Abre el canal de conexión con guías espirituales",
      "Aroma balsámico, cítrico y expansivo"
    ],
    prayer: "Gran Espíritu del Copal, eleva mis intenciones; que este humo blanco transforme toda sombra en luz celestial.",
    direction: "Centro (Éter)"
  },
  {
    id: "palosanto",
    name: "Palo Santo Sagrado",
    botanical: "Bursera graveolens",
    type: "madera",
    smokeColor: "rgba(250, 245, 230, 0.4)",
    glowColor: "#FBBF24",
    purpose: "Instala paz armónica, magnetiza bendiciones y reconecta con el gozo del corazón.",
    benefits: [
      "Atrae calma mental tras momentos de angustia",
      "Bendice y sella el hogar con amor sereno",
      "Madera sagrada recolectada de ramas caídas naturalmente"
    ],
    prayer: "Madera santa del perdón y la paz, sana mis heridas; llena este templo con amor inquebrantable.",
    direction: "Sur (Fuego)"
  },
  {
    id: "salvia",
    name: "Salvia Blanca",
    botanical: "Salvia apiana",
    type: "hierba",
    smokeColor: "rgba(220, 235, 225, 0.45)",
    glowColor: "#34D399",
    purpose: "Neutralización de cargas psíquicas pesadas, reseteo energético total y corte de lazos.",
    benefits: [
      "Libera residuos energéticos de discusiones o visitas densas",
      "Genera una atmósfera cristalina de reinicio",
      "Astringente, herbácea y profundamente sanadora"
    ],
    prayer: "Abuela Salvia, barre todo lo que no sea amor; limpia mi mente, mi aura y mi morada.",
    direction: "Oeste (Agua)"
  },
  {
    id: "ruda-romero",
    name: "Ruda Macho & Romero",
    botanical: "Ruta graveolens & Rosmarinus",
    type: "hierba",
    smokeColor: "rgba(235, 250, 225, 0.4)",
    glowColor: "#10B981",
    purpose: "Escudo protector contra envidias, mal de ojo y agotamiento por vampirismo energético.",
    benefits: [
      "Actúa como coraza de blindaje áurico inmediato",
      "Devuelve la vitalidad física y la claridad de propósito",
      "Corta cordones de dependencia tóxica"
    ],
    prayer: "Ruda y Romero de la Tierra bendita, sellen mi campo; ningún daño ni discordia podrá tocar mi paz.",
    direction: "Norte (Tierra)"
  },
  {
    id: "mirra-lavanda",
    name: "Mirra & Flores de Lavanda",
    botanical: "Commiphora myrrha & Lavandula",
    type: "resina",
    smokeColor: "rgba(240, 230, 255, 0.45)",
    glowColor: "#C084FC",
    purpose: "Sosiego nocturno, bálsamo para el dolor emocional y apertura al sueño reparador místico.",
    benefits: [
      "Calma palpitaciones y ansiedad antes de dormir",
      "Consagra el espacio de descanso como templo de sueños",
      "Funde resina milenaria con la dulzura de la lavanda"
    ],
    prayer: "Bálsamo sagrado de Mirra y Flor celeste, arrulla mi espíritu en paz y restaura mi templo interior.",
    direction: "Este (Aire)"
  }
];

export function SmudgingAltar() {
  const [activeHerb, setActiveHerb] = useState<HerbResin>(SACRED_HERBS[0]);
  const [isBurning, setIsBurning] = useState(true);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [featherFanIntensity, setFeatherFanIntensity] = useState(1);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Inicializar sonido de brasas y humo suave
  useEffect(() => {
    let ctx: AudioContext | null = null;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // Generar ruido blanco filtrado simulando crepitar suave y aire cálido
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Filtro browniano suave
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        data[i] *= 1.8;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(450, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(isAudioMuted ? 0 : 0.05, ctx.currentTime);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();

      noiseNodeRef.current = noise;
      gainNodeRef.current = gain;
    } catch (e) {
      console.warn("Audio init warning:", e);
    }

    return () => {
      try {
        if (noiseNodeRef.current) (noiseNodeRef.current as any).stop?.();
        if (ctx && ctx.state !== "closed") ctx.close().catch(() => {});
      } catch (e) {}
    };
  }, []);

  // Control de volumen de audio
  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      const targetGain = isBurning && !isAudioMuted ? 0.05 * featherFanIntensity : 0.0001;
      gainNodeRef.current.gain.linearRampToValueAtTime(
        targetGain,
        audioCtxRef.current.currentTime + 0.3
      );
    }
  }, [isAudioMuted, isBurning, featherFanIntensity]);

  // Simulación física de partículas de humo y chispas en Canvas
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

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      maxAlpha: number;
      life: number;
      maxLife: number;
      type: "smoke" | "spark";
    }

    const particles: Particle[] = [];
    const originX = width / 2;
    const originY = height - 90;

    let frameCount = 0;

    const render = () => {
      frameCount++;
      ctx.clearRect(0, 0, width, height);

      // Dibujar resplandor de brasa en el cuenco
      if (isBurning) {
        const glow = ctx.createRadialGradient(
          width / 2,
          height - 85,
          5,
          width / 2,
          height - 85,
          80
        );
        glow.addColorStop(0, "rgba(249, 115, 22, 0.75)");
        glow.addColorStop(0.3, "rgba(234, 88, 12, 0.3)");
        glow.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(width / 2, height - 85, 80, 0, Math.PI * 2);
        ctx.fill();

        // Emisión continua de partículas de humo
        const spawnCount = Math.floor(2 * featherFanIntensity);
        for (let i = 0; i < spawnCount; i++) {
          particles.push({
            x: width / 2 + (Math.random() - 0.5) * 20,
            y: height - 90 + (Math.random() - 0.5) * 6,
            vx: (Math.random() - 0.5) * 0.7 * featherFanIntensity,
            vy: -(1.2 + Math.random() * 1.5) * featherFanIntensity,
            size: 8 + Math.random() * 8,
            alpha: 0.05,
            maxAlpha: 0.35 + Math.random() * 0.2,
            life: 0,
            maxLife: 140 + Math.random() * 60,
            type: "smoke"
          });
        }

        // Chispas ocasionales
        if (frameCount % 4 === 0) {
          particles.push({
            x: width / 2 + (Math.random() - 0.5) * 30,
            y: height - 88,
            vx: (Math.random() - 0.5) * 1.6,
            vy: -(2.5 + Math.random() * 2),
            size: 1.5 + Math.random() * 2,
            alpha: 1,
            maxAlpha: 1,
            life: 0,
            maxLife: 40 + Math.random() * 30,
            type: "spark"
          });
        }
      }

      // Actualizar y pintar partículas
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;

        if (p.type === "smoke") {
          // Turbulencia armónica
          p.x += p.vx + Math.sin((p.life + frameCount) * 0.03) * 0.6;
          p.y += p.vy;
          p.size += 0.45; // El humo se expande

          // Curva de opacidad (aparece y luego se desvanece suavemente)
          const progress = p.life / p.maxLife;
          if (progress < 0.2) {
            p.alpha = (progress / 0.2) * p.maxAlpha;
          } else {
            p.alpha = (1 - progress) * p.maxAlpha;
          }

          ctx.fillStyle = activeHerb.smokeColor;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Chispa incandescente
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.04; // Gravedad leve
          p.alpha = 1 - p.life / p.maxLife;

          ctx.fillStyle = `rgba(255, 200, 80, ${p.alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        if (p.life >= p.maxLife || p.alpha <= 0) {
          particles.splice(i, 1);
        }
      }

      // Base del Sahumador (Sahumador de barro negro o concha sagrada)
      ctx.save();
      const bowlX = width / 2;
      const bowlY = height - 60;

      // Sombra proyectada
      ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
      ctx.beginPath();
      ctx.ellipse(bowlX, bowlY + 30, 80, 16, 0, 0, Math.PI * 2);
      ctx.fill();

      // Cuenco de barro ceremonial
      const bowlGrad = ctx.createLinearGradient(
        bowlX - 60,
        bowlY,
        bowlX + 60,
        bowlY + 25
      );
      bowlGrad.addColorStop(0, "#261910");
      bowlGrad.addColorStop(0.5, "#422818");
      bowlGrad.addColorStop(1, "#180F09");

      ctx.fillStyle = bowlGrad;
      ctx.beginPath();
      ctx.ellipse(bowlX, bowlY, 65, 20, 0, 0, Math.PI);
      ctx.lineTo(bowlX - 30, bowlY + 25);
      ctx.arc(bowlX, bowlY + 25, 30, Math.PI, 0, true);
      ctx.lineTo(bowlX + 65, bowlY);
      ctx.fill();

      // Borde tallado sagrado
      ctx.strokeStyle = "#8C5835";
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Boca del cuenco (interior con carbón)
      ctx.fillStyle = "#120C08";
      ctx.beginPath();
      ctx.ellipse(bowlX, bowlY, 60, 14, 0, 0, Math.PI * 2);
      ctx.fill();

      // Carbón vegetal incandescente
      if (isBurning) {
        ctx.fillStyle = "#E25822";
        ctx.beginPath();
        ctx.ellipse(bowlX, bowlY, 35, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#FFAE42";
        ctx.beginPath();
        ctx.ellipse(bowlX + 4, bowlY - 1, 15, 4, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [activeHerb, isBurning, featherFanIntensity]);

  const handleCopyPrayer = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(activeHerb.prayer);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Función para agitar con la pluma (avivar las brasas)
  const handleFanFeather = () => {
    setFeatherFanIntensity(2.2);
    setTimeout(() => {
      setFeatherFanIntensity(1);
    }, 1800);
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-4 space-y-8 text-[#F8F9FA]">
      {/* Encabezado */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-semibold tracking-widest uppercase">
          <Flame size={14} className="text-amber-400 animate-pulse" />
          <span>Ritual Chamánico de Limpieza</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-sacred font-bold text-white tracking-wide">
          Altar Virtual de Sahumado
        </h2>
        <p className="text-xs sm:text-sm text-stone-300 font-sans">
          Aviva las brasas sagradas con la pluma ceremonial. Selecciona la medicina herbal o resina pura para disolver densidades y purificar tu campo energético.
        </p>
      </div>

      {/* Grid Altar + Controles */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Canvas de Humo Físico (6 cols) */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-4 bg-gradient-to-b from-[#180E06]/70 via-[#100A05]/80 to-[#0A0704] border border-amber-500/20 rounded-3xl relative overflow-hidden shadow-2xl">
          {/* Fondo etéreo místico */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_70%,rgba(245,158,11,0.08),transparent_70%)] pointer-events-none" />

          {/* Canvas */}
          <div className="w-full relative z-10 flex justify-center">
            <canvas ref={canvasRef} className="w-full max-w-md h-[400px]" />
          </div>

          {/* Barra de Controles del Altar */}
          <div className="w-full max-w-md mt-2 pt-4 border-t border-white/[0.08] flex items-center justify-between gap-3 px-2 z-20">
            {/* Botón Avivar con Pluma */}
            <button
              onClick={handleFanFeather}
              disabled={!isBurning}
              className="px-4 py-2 rounded-full border border-amber-400/40 bg-amber-500/20 text-amber-200 text-xs font-semibold flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-md disabled:opacity-40"
            >
              <Feather size={15} className="text-amber-300" />
              <span>Avivar con Pluma</span>
            </button>

            {/* Toggle Encendido / Extinguido */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsBurning(!isBurning)}
                className={`p-2.5 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
                  isBurning
                    ? "border-amber-400/40 bg-amber-400/15 text-amber-300"
                    : "border-white/10 bg-white/5 text-stone-400"
                }`}
                title={isBurning ? "Apagar sahumador" : "Encender sahumador"}
              >
                <Flame size={16} />
              </button>

              <button
                onClick={() => setIsAudioMuted(!isAudioMuted)}
                className="p-2.5 rounded-full border border-white/10 bg-white/5 text-stone-300 hover:text-white transition-all cursor-pointer"
                title={isAudioMuted ? "Activar sonido de brasa" : "Silenciar sonido"}
              >
                {isAudioMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
            </div>
          </div>
        </div>

        {/* Panel de Hierbas y Resinas (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Selector de Hierbas */}
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-amber-300 block mb-3">
              Selecciona tu Medicina Botánica:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {SACRED_HERBS.map((herb) => {
                const isSelected = activeHerb.id === herb.id;
                return (
                  <button
                    key={herb.id}
                    onClick={() => setActiveHerb(herb)}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? "border-amber-400 bg-amber-400/15 shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                        : "border-white/10 bg-[#120C07]/70 hover:border-white/25"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-sacred font-bold text-white">
                        {herb.name}
                      </span>
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: herb.glowColor }}
                      />
                    </div>
                    <span className="text-[10px] text-amber-300/80 font-mono mt-1">
                      {herb.direction}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ficha Activa */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeHerb.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-6 rounded-3xl border border-white/10 bg-gradient-to-b from-[#1B1107] to-[#0D0804] space-y-5 shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-sacred font-bold text-white">
                    {activeHerb.name}
                  </h3>
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-300 capitalize">
                    {activeHerb.type}
                  </span>
                </div>
                <p className="text-xs italic text-stone-400 mt-0.5">
                  {activeHerb.botanical} · Dirección {activeHerb.direction}
                </p>
                <p className="text-xs text-stone-300 font-sans mt-3 leading-relaxed">
                  {activeHerb.purpose}
                </p>
              </div>

              {/* Beneficios */}
              <div className="p-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <Sparkles size={13} />
                  Propiedades del Humo Sagrado
                </span>
                <ul className="space-y-1 text-xs text-stone-300">
                  {activeHerb.benefits.map((ben, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-400 text-sm">✦</span>
                      <span>{ben}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Decreto / Oración */}
              <div className="p-4 rounded-2xl border border-amber-400/30 bg-amber-500/10 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-amber-300">
                    Oración de Sahumado
                  </span>
                  <p className="text-xs font-editorial italic text-amber-100">
                    "{activeHerb.prayer}"
                  </p>
                </div>
                <button
                  onClick={handleCopyPrayer}
                  className="p-2.5 rounded-xl border border-amber-400/30 bg-amber-400/20 text-amber-200 hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer"
                  title="Copiar oración"
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

export default SmudgingAltar;
