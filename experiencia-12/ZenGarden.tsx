"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Droplets,
  Wind,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  Compass,
  CheckCircle2,
  ShieldCheck,
  Circle
} from "lucide-react";

export interface ZenStone {
  id: string;
  x: number;
  y: number;
  radius: number;
  name: string;
  type: "rio" | "cuarzo" | "jade" | "obsidiana";
  colorGrad: string[];
}

export function ZenGarden() {
  const [stones, setStones] = useState<ZenStone[]>([
    {
      id: "s-1",
      x: 140,
      y: 130,
      radius: 22,
      name: "Piedra de la Serenidad",
      type: "rio",
      colorGrad: ["#44403C", "#292524", "#1C1917"]
    },
    {
      id: "s-2",
      x: 280,
      y: 240,
      radius: 28,
      name: "Roca de la Presencia",
      type: "rio",
      colorGrad: ["#57534E", "#3A3532", "#1C1917"]
    },
    {
      id: "s-3",
      x: 230,
      y: 100,
      radius: 16,
      name: "Cuarzo Blanco",
      type: "cuarzo",
      colorGrad: ["#F8FAFC", "#CBD5E1", "#94A3B8"]
    }
  ]);

  const [selectedStoneType, setSelectedStoneType] = useState<"rio" | "cuarzo" | "jade" | "obsidiana">("rio");
  const [rakeToolSize, setRakeToolSize] = useState<number>(18);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sandCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const isDrawingRef = useRef(false);

  // Inicializar sonido de rastrillo sobre arena
  const playRakeSound = () => {
    if (isAudioMuted) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = audioCtxRef.current || new AudioCtx();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(180 + Math.random() * 40, ctx.currentTime);

      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.02, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {}
  };

  // Inicializar Canvas de Arena
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    sandCtxRef.current = ctx;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    const height = (canvas.height = 420);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = 420;
      resetSand();
    };
    window.addEventListener("resize", handleResize);

    resetSand();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Alisar y reiniciar arena con textura fina
  const resetSand = () => {
    const canvas = canvasRef.current;
    const ctx = sandCtxRef.current;
    if (!canvas || !ctx) return;

    // Fondo arena dorada pálida
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, "#D7C4A5");
    grad.addColorStop(0.5, "#E6D7BD");
    grad.addColorStop(1, "#CEB896");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Ondas concéntricas zen alrededor de las piedras colocadas
    stones.forEach((stone) => {
      for (let r = stone.radius + 8; r < stone.radius + 36; r += 7) {
        ctx.strokeStyle = "rgba(168, 142, 105, 0.4)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(stone.x, stone.y, r, 0, Math.PI * 2);
        ctx.stroke();
      }
    });

    // Dibujar piedras
    drawStonesOnCanvas(ctx);
  };

  const drawStonesOnCanvas = (ctx: CanvasRenderingContext2D) => {
    stones.forEach((stone) => {
      // Sombra proyectada
      ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
      ctx.beginPath();
      ctx.ellipse(stone.x + 4, stone.y + stone.radius * 0.6, stone.radius, stone.radius * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Cuerpo de la piedra con degradado orgánico
      const grad = ctx.createRadialGradient(
        stone.x - stone.radius * 0.3,
        stone.y - stone.radius * 0.3,
        2,
        stone.x,
        stone.y,
        stone.radius
      );
      grad.addColorStop(0, stone.colorGrad[0]);
      grad.addColorStop(0.6, stone.colorGrad[1]);
      grad.addColorStop(1, stone.colorGrad[2]);

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(stone.x, stone.y, stone.radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      ctx.lineWidth = 1;
      ctx.stroke();
    });
  };

  // Trazo interactivo con el rastrillo
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = true;
    handlePointerMove(e);
  };

  const handlePointerUp = () => {
    isDrawingRef.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    const ctx = sandCtxRef.current;
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Surco de rastrillo
    ctx.strokeStyle = "rgba(148, 120, 85, 0.6)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, rakeToolSize / 2, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(x + 2, y + 2, (rakeToolSize / 2) + 2, 0, Math.PI);
    ctx.stroke();

    playRakeSound();
  };

  // Agregar nueva piedra al hacer doble clic o clic largo
  const handleAddStone = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.detail === 2) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      let colorGrad = ["#44403C", "#292524", "#1C1917"];
      let name = "Piedra de Río";
      if (selectedStoneType === "cuarzo") {
        colorGrad = ["#F8FAFC", "#CBD5E1", "#94A3B8"];
        name = "Cuarzo Blanco";
      } else if (selectedStoneType === "jade") {
        colorGrad = ["#86EFAC", "#22C55E", "#14532D"];
        name = "Jade Sereno";
      } else if (selectedStoneType === "obsidiana") {
        colorGrad = ["#262626", "#171717", "#0A0A0A"];
        name = "Obsidiana Zen";
      }

      const newStone: ZenStone = {
        id: `stone-${Date.now()}`,
        x,
        y,
        radius: 18 + Math.floor(Math.random() * 10),
        name,
        type: selectedStoneType,
        colorGrad
      };

      setStones((prev) => [...prev, newStone]);
      setTimeout(resetSand, 50);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-4 space-y-8 text-[#F8F9FA]">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-lime-500/30 bg-lime-500/10 text-lime-300 text-xs font-semibold tracking-widest uppercase">
          <Droplets size={14} className="text-lime-400" />
          <span>Karesansui & Quietud Mental</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-sacred font-bold text-white tracking-wide">
          Jardín Zen de Arena y Piedras
        </h2>
        <p className="text-xs sm:text-sm text-stone-300 font-sans">
          Arrastra tu cursor o dedo sobre la arena sagrada para rastrillar surcos meditativos.
          Haz doble clic para colocar piedras de río, cuarzo o jade y contemplar las ondas del vacío.
        </p>
      </div>

      {/* Grid: Canvas Karesansui + Controles Zen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Canvas de Arena Karesansui (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center p-4 bg-gradient-to-b from-[#1C160F] to-[#0D0A06] border-4 border-[#3D2817] rounded-3xl relative overflow-hidden shadow-2xl">
          {/* Borde de madera de cerezo del jardín */}
          <div className="w-full relative flex justify-center rounded-2xl overflow-hidden shadow-inner cursor-crosshair">
            <canvas
              ref={canvasRef}
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
              onPointerMove={handlePointerMove}
              onClick={handleAddStone}
              className="w-full max-w-lg h-[400px] touch-none select-none"
            />
          </div>

          {/* Barra de Acciones del Jardín */}
          <div className="w-full max-w-lg mt-3 pt-3 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3 text-xs">
            <button
              onClick={resetSand}
              className="px-4 py-2 rounded-full border border-amber-400/40 bg-amber-500/20 text-amber-200 text-xs font-semibold flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-md"
            >
              <RotateCcw size={14} />
              <span>Alisar Arena (Brisa Zen)</span>
            </button>

            <span className="text-[11px] text-stone-400 font-sans">
              Doble clic para poner roca
            </span>

            <button
              onClick={() => setIsAudioMuted(!isAudioMuted)}
              className="p-2 rounded-full border border-white/10 bg-white/5 text-stone-300 hover:text-white cursor-pointer"
            >
              {isAudioMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
          </div>
        </div>

        {/* Panel de Piedras & Filosofía Zen (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Selector de Tipo de Piedra para Colocar */}
          <div className="p-6 rounded-3xl border border-white/10 bg-gradient-to-b from-[#171109] to-[#0A0704] space-y-4 shadow-xl">
            <span className="text-xs uppercase tracking-wider font-semibold text-amber-300 block">
              Piedra Seleccionada para tu Jardín:
            </span>

            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "rio", name: "Piedra de Río", desc: "Anclaje & Quietud", color: "#44403C" },
                { id: "cuarzo", name: "Cuarzo Blanco", desc: "Claridad & Luz", color: "#F8FAFC" },
                { id: "jade", name: "Jade Verde", desc: "Salud & Fortuna", color: "#22C55E" },
                { id: "obsidiana", name: "Obsidiana", desc: "Protección Total", color: "#171717" }
              ].map((p) => {
                const isSelected = selectedStoneType === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedStoneType(p.id as any)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-amber-400 bg-amber-400/20 text-white shadow-md"
                        : "border-white/10 bg-white/5 text-stone-300 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/40 shrink-0"
                        style={{ backgroundColor: p.color }}
                      />
                      <span className="text-xs font-semibold">{p.name}</span>
                    </div>
                    <span className="text-[10px] text-stone-400 block mt-1">
                      {p.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sabiduría Karesansui */}
          <div className="p-6 rounded-3xl border border-white/10 bg-[#100C07] space-y-3 shadow-xl">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <Compass size={13} />
              Enseñanza del Vacío y la Forma
            </span>
            <p className="text-xs text-stone-300 leading-relaxed font-sans">
              En la tradición Zen, la arena simboliza el océano de la mente en calma, y las piedras representan las islas inmutables del ser. Al rastrillar, no buscas una perfección rígida, sino una mente desapegada de la prisa del mundo.
            </p>
            <div className="pt-2 border-t border-white/[0.06] text-[11px] text-amber-200/80 italic font-editorial">
              "En la arena quieta, cada trazo refleja el silencio de tu respiración."
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ZenGarden;
