"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Droplets,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Compass,
  CheckCircle2,
  Copy,
  ShieldCheck,
  RotateCcw
} from "lucide-react";

export interface Gemstone {
  id: string;
  name: string;
  chemicalFormula: string;
  chakra: string;
  colorHex: string;
  glowHex: string;
  elixirType: "solar" | "lunar" | "indirecto";
  properties: string;
  safetynote: string;
  dosage: string;
  mantra: string;
}

export const GEMSTONES_DATA: Gemstone[] = [
  {
    id: "amatista",
    name: "Amatista Violeta",
    chemicalFormula: "SiO₂ con trazas de Fe³⁺",
    chakra: "Tercer Ojo y Corona",
    colorHex: "#A855F7",
    glowHex: "rgba(168, 85, 247, 0.5)",
    elixirType: "lunar",
    properties: "Calma tormentas mentales, disuelve insomnio, potencia la visión de sueños lúcidos y transmuta bajas frecuencias.",
    safetynote: "Segura en método indirecto. Carga óptima bajo la Luna Llena.",
    dosage: "7 gotas bajo la lengua antes de meditar o dormir.",
    mantra: "Mi mente reposa en la quietud cristalina del espíritu."
  },
  {
    id: "cuarzo-rosa",
    name: "Cuarzo Rosa del Amor",
    chemicalFormula: "SiO₂ con trazas de Ti, Fe, Mn",
    chakra: "Chakra Corazón (Anahata)",
    colorHex: "#F472B6",
    glowHex: "rgba(244, 114, 182, 0.5)",
    elixirType: "solar",
    properties: "Sana heridas de desamor, disuelve corazas de rencor, restaura la autoestima y la dulzura.",
    safetynote: "Gema dura y segura para infusión directa en agua de manantial cristalino.",
    dosage: "5 gotas al despertar y 5 al atardecer en spray facial o bucal.",
    mantra: "Merezco amor puro; mi corazón late en paz y ternura."
  },
  {
    id: "citrino",
    name: "Citrino Dorado Solar",
    chemicalFormula: "SiO₂ con óxidos de hierro",
    chakra: "Plexo Solar (Manipura)",
    colorHex: "#FBBF24",
    glowHex: "rgba(251, 191, 36, 0.5)",
    elixirType: "solar",
    properties: "Poder personal, fuerza de arranque, atracción de abundancia económica y optimismo radiante.",
    safetynote: "No retiene energía densa; se recarga con el sol matutino.",
    dosage: "10 gotas en ayunas disueltas en medio vaso de agua.",
    mantra: "Soy un imán de bendiciones y prosperidad infinita."
  },
  {
    id: "selenita",
    name: "Selenita Blanca Lunar",
    chemicalFormula: "CaSO₄ · 2H₂O (Yeso cristalino)",
    chakra: "Estrella del Alma y Corona Superior",
    colorHex: "#E2E8F0",
    glowHex: "rgba(226, 232, 240, 0.5)",
    elixirType: "indirecto",
    properties: "Puente con el reino angélico, purificación instantánea del aura y disolución de cordones kármicos.",
    safetynote: "IMPORTANTE: Es soluble en agua. Utilizar EXCLUSIVAMENTE método indirecto (colocar el cristal junto a la botella sin sumergirlo).",
    dosage: "Bruma en spray para el campo áurico y la habitación.",
    mantra: "La luz blanca y pura disuelve cualquier sombra a mi alrededor."
  },
  {
    id: "turmalina",
    name: "Turmalina Negra",
    chemicalFormula: "Silicato complejo de boro y aluminio",
    chakra: "Chakra Raíz (Muladhara)",
    colorHex: "#475569",
    glowHex: "rgba(71, 85, 105, 0.5)",
    elixirType: "indirecto",
    properties: "Blindaje electromagnético contra 5G, computadoras, envidias y drenaje de vitalidad.",
    safetynote: "Mineral de alta densidad de metales; se aconseja método indirecto.",
    dosage: "3 gotas antes de asistir a lugares concurridos o de alta carga.",
    mantra: "Estoy plenamente enraizado y protegido por la Madre Tierra."
  }
];

export function CrystalElixirs() {
  const [selectedGem, setSelectedGem] = useState<Gemstone>(GEMSTONES_DATA[0]);
  const [chargeMethod, setChargeMethod] = useState<"lunar" | "solar">("lunar");
  const [isActivating, setIsActivating] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [copied, setCopied] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);

  const playCrystalChime = () => {
    if (isAudioMuted) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = audioCtxRef.current || new AudioCtx();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(1056, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(528, ctx.currentTime + 2.5);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.07, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.0);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 3.2);
    } catch (e) {}
  };

  const handleActivateElixir = () => {
    setIsActivating(true);
    playCrystalChime();
    setTimeout(() => {
      setIsActivating(false);
    }, 2800);
  };

  const handleCopyMantra = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(selectedGem.mantra);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-4 space-y-8 text-[#F8F9FA]">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-semibold tracking-widest uppercase">
          <Droplets size={14} className="text-cyan-400" />
          <span>Gemoterapia & Agua Estructurada</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-sacred font-bold text-white tracking-wide">
          Laboratorio de Elixires y Cristales
        </h2>
        <p className="text-xs sm:text-sm text-stone-300 font-sans">
          Estructura el agua biológica con las frecuencias geométricas de las gemas cuánticas.
          Aprende el método solar o lunar para armonizar tus células.
        </p>
      </div>

      {/* Grid: Matraz Alquímico Visual + Enciclopedia Gemológica */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Matraz Alquímico en Canvas/SVG (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#0C151B]/80 via-[#070D12]/90 to-[#030608] border border-cyan-500/25 rounded-3xl relative overflow-hidden shadow-2xl">
          {/* Resplandor de fondo de la gema activa */}
          <div
            className="absolute inset-0 blur-3xl opacity-25 pointer-events-none transition-all duration-700"
            style={{ backgroundColor: selectedGem.colorHex }}
          />

          {/* Matraz de Cristal con Agua Estructurada */}
          <div className="relative w-64 h-80 flex flex-col items-center justify-end select-none">
            {/* Partículas de activación cuántica */}
            {isActivating && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <Sparkles className="w-10 h-10 text-amber-300 animate-ping" />
              </motion.div>
            )}

            {/* Cuello del matraz */}
            <div className="w-14 h-16 border-x-2 border-t-2 border-white/30 bg-white/[0.04] rounded-t-lg backdrop-blur-sm relative">
              {/* Tapón de corcho sagrado */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-4 bg-[#78350F] rounded-sm border border-amber-900 shadow-md" />
            </div>

            {/* Cuerpo del matraz esférico / cónico */}
            <div className="w-56 h-56 rounded-full border-2 border-white/30 bg-white/[0.03] backdrop-blur-md relative overflow-hidden flex flex-col justify-end p-2 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
              {/* Nivel de agua estructurada */}
              <motion.div
                animate={{
                  y: [0, -3, 0],
                  filter: isActivating ? ["brightness(1)", "brightness(1.5)", "brightness(1)"] : "brightness(1)"
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-full h-36 rounded-b-full relative overflow-hidden transition-all duration-700"
                style={{
                  background: `linear-gradient(to top, ${selectedGem.colorHex} 0%, ${selectedGem.glowHex} 70%, transparent 100%)`,
                  opacity: 0.75
                }}
              >
                {/* Cristal sumergido o en el centro */}
                <div className="absolute inset-0 m-auto w-12 h-16 flex items-center justify-center">
                  <div
                    className="w-10 h-14 rounded-lg rotate-45 border border-white/60 shadow-lg"
                    style={{ backgroundColor: selectedGem.colorHex }}
                  />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Botón de Activación Cuántica */}
          <div className="w-full max-w-xs mt-6 flex flex-col items-center gap-3">
            <button
              onClick={handleActivateElixir}
              disabled={isActivating}
              className="w-full py-3 rounded-full border border-cyan-400 bg-gradient-to-r from-cyan-600 to-teal-600 text-white text-xs font-semibold flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg cursor-pointer disabled:opacity-50"
            >
              <Sparkles size={16} className={isActivating ? "animate-spin" : ""} />
              <span>{isActivating ? "Estructurando Agua..." : "Activar Elixir con Luz & Sonido"}</span>
            </button>

            <button
              onClick={() => setIsAudioMuted(!isAudioMuted)}
              className="text-[11px] text-stone-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              {isAudioMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
              <span>{isAudioMuted ? "Sonido silenciado" : "Frecuencia de cuarzo 528 Hz"}</span>
            </button>
          </div>
        </div>

        {/* Panel de Gemas & Instrucciones Alquímicas (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Selector de Cristales */}
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-cyan-300 block mb-3">
              Selecciona la Gema Cuántica:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {GEMSTONES_DATA.map((gem) => {
                const isSelected = selectedGem.id === gem.id;
                return (
                  <button
                    key={gem.id}
                    onClick={() => {
                      setSelectedGem(gem);
                      playCrystalChime();
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-cyan-400 bg-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                        : "border-white/10 bg-[#0C1217]/60 text-stone-300 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-sacred font-bold text-white">
                        {gem.name.split(" ")[0]}
                      </span>
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: gem.colorHex }}
                      />
                    </div>
                    <span className="text-[10px] text-stone-400 block mt-1 truncate">
                      {gem.chakra.split(" ")[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ficha Alquímica Activa */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedGem.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-6 rounded-3xl border border-white/10 bg-gradient-to-b from-[#0E161C] to-[#060A0D] space-y-5 shadow-2xl"
            >
              <div className="border-b border-white/10 pb-4 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-xl sm:text-2xl font-sacred font-bold text-white">
                    {selectedGem.name}
                  </h3>
                  <p className="text-xs text-cyan-300 font-sans mt-0.5">
                    Chakra: {selectedGem.chakra} · Fórmula: {selectedGem.chemicalFormula}
                  </p>
                </div>
                <span className="text-xs font-mono px-3 py-1 rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-300 capitalize">
                  Método {selectedGem.elixirType}
                </span>
              </div>

              {/* Propiedades & Precaución */}
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl border border-white/[0.08] bg-white/[0.02]">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-cyan-300 block mb-1">
                    Acción Terapéutica en el Cuerpo Sutil
                  </span>
                  <p className="text-xs text-stone-200 leading-relaxed font-sans">
                    {selectedGem.properties}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl border border-amber-400/20 bg-amber-500/5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-300 block mb-1">
                    Protocolo de Seguridad Alquímica
                  </span>
                  <p className="text-xs text-stone-300 leading-relaxed font-sans">
                    {selectedGem.safetynote}
                  </p>
                </div>
              </div>

              {/* Posología & Mantra */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl border border-white/10 bg-[#091014] space-y-1">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 block font-semibold">
                    Dosis Recomendada
                  </span>
                  <p className="text-stone-300">{selectedGem.dosage}</p>
                </div>

                <div className="p-3.5 rounded-2xl border border-cyan-400/30 bg-cyan-500/10 flex items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-cyan-300 block font-semibold">
                      Mantra de Activación
                    </span>
                    <p className="font-editorial italic text-cyan-100">
                      "{selectedGem.mantra}"
                    </p>
                  </div>
                  <button
                    onClick={handleCopyMantra}
                    className="p-2 rounded-xl border border-cyan-400/30 bg-cyan-400/20 text-cyan-200 hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer"
                  >
                    {copied ? <CheckCircle2 size={15} className="text-emerald-400" /> : <Copy size={15} />}
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default CrystalElixirs;
