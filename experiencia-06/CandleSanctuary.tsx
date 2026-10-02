"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  Sparkles,
  Volume2,
  VolumeX,
  Plus,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  Heart,
  Scroll,
  X
} from "lucide-react";

export interface VotiveCandle {
  id: string;
  colorName: string;
  colorHex: string;
  glowHex: string;
  flameColor: string;
  rayName: string;
  purpose: string;
  guardian: string;
  intention?: string;
  isLit: boolean;
  litAt?: Date;
}

export const CANDLE_PRESETS: Omit<VotiveCandle, "id" | "isLit">[] = [
  {
    colorName: "Vela Blanca",
    colorHex: "#FFFFFF",
    glowHex: "rgba(255, 255, 255, 0.5)",
    flameColor: "#FFF3B0",
    rayName: "Rayo Blanco de la Pureza",
    purpose: "Claridad mental, bendición del hogar, purificación y paz absoluta.",
    guardian: "Arcángel Gabriel"
  },
  {
    colorName: "Vela Dorada / Amarilla",
    colorHex: "#FBBF24",
    glowHex: "rgba(251, 191, 36, 0.5)",
    flameColor: "#F59E0B",
    rayName: "Rayo Oro-Rubí de la Sabiduría",
    purpose: "Abundancia material, discernimiento lúcido, éxito e iluminación de proyectos.",
    guardian: "Arcángel Jofiel & Uriel"
  },
  {
    colorName: "Vela Azul Zafiro",
    colorHex: "#38BDF8",
    glowHex: "rgba(56, 189, 248, 0.5)",
    flameColor: "#60A5FA",
    rayName: "Rayo Azul de la Voluntad Divina",
    purpose: "Protección contra todo peligro, coraje, fuerza de voluntad y justicia.",
    guardian: "Arcángel Miguel"
  },
  {
    colorName: "Vela Rosa Amor",
    colorHex: "#F472B6",
    glowHex: "rgba(244, 114, 182, 0.5)",
    flameColor: "#FB7185",
    rayName: "Rayo Rosa del Amor Incondicional",
    purpose: "Sanación de lazos afectivos, autoestima, dulzura, perdón y apertura del corazón.",
    guardian: "Arcángel Chamuel"
  },
  {
    colorName: "Vela Verde Esmeralda",
    colorHex: "#34D399",
    glowHex: "rgba(52, 211, 153, 0.5)",
    flameColor: "#10B981",
    rayName: "Rayo Verde de la Sanación",
    purpose: "Salud física, regeneración celular, esperanza y prosperidad natural.",
    guardian: "Arcángel Rafael"
  },
  {
    colorName: "Vela Violeta Transmutadora",
    colorHex: "#C084FC",
    glowHex: "rgba(192, 132, 252, 0.5)",
    flameColor: "#A855F7",
    rayName: "Llama Violeta de la Transmutación",
    purpose: "Disolver karma pesado, perdón cuántico y transmutación de tristezas.",
    guardian: "Arcángel Zadkiel"
  }
];

export function CandleSanctuary() {
  const [altarCandles, setAltarCandles] = useState<VotiveCandle[]>([
    {
      id: "c-1",
      ...CANDLE_PRESETS[0],
      isLit: true,
      intention: "Paz, bendición y claridad para este momento sagrado.",
      litAt: new Date()
    },
    {
      id: "c-2",
      ...CANDLE_PRESETS[4],
      isLit: true,
      intention: "Sanación integral de cuerpo, mente y alma.",
      litAt: new Date()
    },
    {
      id: "c-3",
      ...CANDLE_PRESETS[1],
      isLit: false
    }
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [newIntention, setNewIntention] = useState("");
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);

  const playSingingBell = () => {
    if (isAudioMuted) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = audioCtxRef.current || new AudioCtx();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 3.0);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 3.6);
    } catch (e) {}
  };

  const handleToggleLight = (id: string) => {
    setAltarCandles((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextLit = !c.isLit;
          if (nextLit) playSingingBell();
          return {
            ...c,
            isLit: nextLit,
            litAt: nextLit ? new Date() : undefined
          };
        }
        return c;
      })
    );
  };

  const handleAddCandle = () => {
    const preset = CANDLE_PRESETS[selectedPresetIndex];
    const newCandle: VotiveCandle = {
      id: `candle-${Date.now()}`,
      ...preset,
      isLit: true,
      intention: newIntention.trim() || "Consagración de luz para el bien mayor.",
      litAt: new Date()
    };
    setAltarCandles((prev) => [...prev, newCandle]);
    playSingingBell();
    setNewIntention("");
    setModalOpen(false);
  };

  const handleRemoveCandle = (id: string) => {
    setAltarCandles((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-4 space-y-8 text-[#F8F9FA]">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-semibold tracking-widest uppercase">
          <Flame size={14} className="text-amber-400 animate-pulse" />
          <span>Fuego Sagrado & Consagración</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-sacred font-bold text-white tracking-wide">
          Santuario de Velación
        </h2>
        <p className="text-xs sm:text-sm text-stone-300 font-sans">
          Enciende una vela devocional en el rayo cósmico correspondiente. Escribe tu plegaria o decreto
          para consagrar la luz divina y sostener la vibración de tu intención.
        </p>
      </div>

      {/* Barra de Acciones del Santuario */}
      <div className="flex flex-wrap items-center justify-between gap-4 max-w-4xl mx-auto p-4 rounded-2xl border border-white/10 bg-[#120C07]/80 backdrop-blur-md">
        <div className="flex items-center gap-2 text-xs text-stone-300">
          <Sparkles size={16} className="text-amber-400" />
          <span>
            Velas en el Altar: <strong className="text-amber-300">{altarCandles.length}</strong> (
            {altarCandles.filter((c) => c.isLit).length} encendidas)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            className="p-2 rounded-xl border border-white/10 bg-white/5 text-stone-300 hover:text-white transition-all cursor-pointer"
            title={isAudioMuted ? "Activar campana" : "Silenciar campana"}
          >
            {isAudioMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 rounded-xl border border-amber-400/40 bg-gradient-to-r from-amber-600/30 to-amber-700/30 text-amber-200 text-xs font-semibold flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer"
          >
            <Plus size={16} />
            <span>Consagrar Nueva Vela</span>
          </button>
        </div>
      </div>

      {/* Altar Principal con las Velas Votivas */}
      <div className="max-w-5xl mx-auto p-6 sm:p-10 rounded-3xl border border-amber-500/25 bg-gradient-to-b from-[#180F08]/90 via-[#100A05]/95 to-[#050302] shadow-2xl relative overflow-hidden">
        {/* Mesa del Altar (efecto madera sagrada / mármol nocturno) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          <AnimatePresence>
            {altarCandles.map((candle) => {
              return (
                <motion.div
                  key={candle.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex flex-col items-center justify-between p-5 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm relative group hover:border-amber-400/30 transition-all"
                >
                  {/* Botón Borrar Vela */}
                  <button
                    onClick={() => handleRemoveCandle(candle.id)}
                    className="absolute top-3 right-3 p-1.5 rounded-lg border border-transparent hover:border-white/10 text-stone-500 hover:text-rose-400 transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                    title="Retirar vela del altar"
                  >
                    <Trash2 size={14} />
                  </button>

                  {/* Vela Visual & Flama Interactiva */}
                  <div
                    onClick={() => handleToggleLight(candle.id)}
                    className="cursor-pointer flex flex-col items-center py-4 my-2 select-none"
                    title={candle.isLit ? "Toca para apagar" : "Toca para encender con fuego sagrado"}
                  >
                    {/* Flama animada */}
                    <div className="h-16 flex items-end justify-center relative">
                      {candle.isLit ? (
                        <div className="relative flex items-center justify-center">
                          {/* Resplandor áurico */}
                          <motion.div
                            animate={{
                              scale: [1, 1.25, 0.95, 1.15, 1],
                              opacity: [0.6, 0.9, 0.7, 0.85, 0.6]
                            }}
                            transition={{
                              duration: 1.8,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                            className="absolute -top-3 w-16 h-16 rounded-full blur-xl pointer-events-none"
                            style={{ backgroundColor: candle.glowHex }}
                          />

                          {/* Cuerpo de la flama */}
                          <motion.div
                            animate={{
                              scaleY: [1, 1.15, 0.92, 1.08, 1],
                              scaleX: [1, 0.9, 1.1, 0.95, 1],
                              rotate: [-1, 2, -2, 1, -1]
                            }}
                            transition={{
                              duration: 0.8,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                            className="w-5 h-12 rounded-full rounded-b-lg shadow-lg relative flex items-center justify-center"
                            style={{
                              background: `radial-gradient(ellipse at 50% 80%, #FFFFFF 0%, ${candle.flameColor} 60%, transparent 100%)`
                            }}
                          >
                            {/* Núcleo azul de combustión */}
                            <div className="absolute bottom-1 w-2.5 h-3 rounded-full bg-blue-400/80 blur-[1px]" />
                          </motion.div>
                        </div>
                      ) : (
                        <div className="h-6 flex flex-col items-center justify-end">
                          <span className="text-[10px] text-stone-500 font-mono tracking-widest uppercase">
                            Apagada
                          </span>
                          <span className="text-xs text-amber-400/80 font-sans mt-0.5">
                            Toca para encender
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Mecha de la vela */}
                    <div className="w-0.5 h-3 bg-stone-700 mx-auto" />

                    {/* Cilindro de Cera Votiva */}
                    <div
                      className="w-14 h-24 rounded-t-lg rounded-b-xl border border-white/20 shadow-inner flex flex-col items-center justify-between py-2 transition-all"
                      style={{
                        backgroundColor: candle.colorHex,
                        boxShadow: candle.isLit
                          ? `0 0 25px ${candle.glowHex}`
                          : "none"
                      }}
                    >
                      <div className="w-10 h-1.5 rounded-full bg-black/10" />
                      <Sparkles
                        size={14}
                        className={candle.colorHex === "#FFFFFF" ? "text-stone-800" : "text-white/80"}
                      />
                    </div>

                    {/* Porta-velas dorado */}
                    <div className="w-20 h-3 rounded-full bg-gradient-to-r from-amber-700 via-amber-400 to-amber-800 border border-amber-300 shadow-md -mt-1" />
                  </div>

                  {/* Información y Decreto de la Vela */}
                  <div className="text-center w-full space-y-2 mt-2 pt-3 border-t border-white/[0.06]">
                    <div>
                      <h4 className="text-sm font-sacred font-bold text-white">
                        {candle.colorName}
                      </h4>
                      <p className="text-[11px] text-amber-300/90 font-mono">
                        {candle.rayName}
                      </p>
                    </div>

                    {/* Intención consagrada */}
                    {candle.intention && (
                      <div className="p-2.5 rounded-xl border border-white/10 bg-[#0C0804] text-[11px] text-stone-300 italic font-editorial">
                        "{candle.intention}"
                      </div>
                    )}

                    <div className="text-[10px] text-stone-400">
                      Custodiado por: <span className="text-stone-300 font-medium">{candle.guardian}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Modal de Consagración de Nueva Vela */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl border border-amber-400/35 bg-gradient-to-b from-[#1C140B] to-[#0A0704] shadow-2xl space-y-6"
            >
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-stone-400 hover:text-white"
              >
                <X size={16} />
              </button>

              <div className="space-y-1">
                <span className="text-xs font-mono uppercase tracking-widest text-amber-300">
                  Rito de Consagración
                </span>
                <h3 className="text-xl sm:text-2xl font-sacred font-bold text-white">
                  Ofrendar Luz al Santuario
                </h3>
              </div>

              {/* Selector de Rayo Cromático */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-stone-300 font-semibold block">
                  Elige el Rayo / Color de la Vela:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CANDLE_PRESETS.map((preset, idx) => {
                    const isSelected = selectedPresetIndex === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedPresetIndex(idx)}
                        className={`p-2.5 rounded-xl border text-left flex items-center gap-2 cursor-pointer transition-all ${
                          isSelected
                            ? "border-amber-400 bg-amber-400/20 text-white shadow-md"
                            : "border-white/10 bg-white/5 text-stone-300 hover:border-white/20"
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full shrink-0 border border-white/30"
                          style={{ backgroundColor: preset.colorHex }}
                        />
                        <span className="text-xs truncate font-medium">
                          {preset.colorName.replace("Vela ", "")}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Detalle del Rayo seleccionado */}
              <div className="p-3.5 rounded-2xl border border-white/10 bg-white/[0.03] text-xs text-stone-300 space-y-1">
                <span className="font-semibold text-amber-300 block">
                  {CANDLE_PRESETS[selectedPresetIndex].rayName}
                </span>
                <p>{CANDLE_PRESETS[selectedPresetIndex].purpose}</p>
                <span className="text-[11px] text-stone-400 block pt-1">
                  Guardián: {CANDLE_PRESETS[selectedPresetIndex].guardian}
                </span>
              </div>

              {/* Input de Intención / Petición Sagrada */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-stone-300 font-semibold block">
                  Escribe tu Intención o Plegaria Sagrada:
                </label>
                <textarea
                  value={newIntention}
                  onChange={(e) => setNewIntention(e.target.value)}
                  placeholder="Por la salud de..., para encontrar serenidad en..., gracias por..."
                  rows={3}
                  className="w-full p-3 rounded-2xl border border-white/15 bg-[#120C07] text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 shadow-inner"
                />
              </div>

              {/* Botón Consagrar y Encender */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddCandle}
                  className="px-5 py-2.5 rounded-full border border-amber-400 bg-gradient-to-r from-amber-600 to-amber-700 text-white text-xs font-semibold flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg cursor-pointer"
                >
                  <Flame size={15} />
                  <span>Consagrar y Encender</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CandleSanctuary;
