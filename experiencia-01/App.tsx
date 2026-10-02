"use client";

import React, { useState, useRef } from "react";
import { ArchangelPortal } from "./ArchangelPortal";
import { Sparkles, Volume2, VolumeX, ShieldCheck } from "lucide-react";

export function App() {
  const [isAudioActive, setIsAudioActive] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  // Sintetizador Sagrado a 528 Hz (Frecuencia Solfeggio del Milagro / Amor)
  const toggleSacredAudio = () => {
    if (isAudioActive) {
      if (oscRef.current) {
        try {
          oscRef.current.stop();
          oscRef.current.disconnect();
        } catch (e) {}
        oscRef.current = null;
      }
      setIsAudioActive(false);
    } else {
      try {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(528, ctx.currentTime); // 528 Hz Amor y Reparación Celular

        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 2);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();

        oscRef.current = osc;
        gainRef.current = gain;
        setIsAudioActive(true);
      } catch (err) {
        console.error("Audio error:", err);
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-[#040508] text-[#F8F9FA] overflow-x-hidden selection:bg-amber-400/30 selection:text-amber-200">
      {/* Header Sagrado */}
      <header className="relative z-50 w-full pt-6 pb-4 px-4 sm:px-8 border-b border-white/[0.06] bg-[#090A10]/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500/20 via-purple-500/20 to-indigo-500/20 border border-amber-400/40 flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.25)]">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <span className="block text-xs uppercase tracking-[0.28em] text-amber-300 font-sans font-semibold">
                Kit de Herramientas Holísticas · Experiencia 01
              </span>
              <h1 className="text-xl sm:text-2xl font-sacred font-bold text-white tracking-wider">
                El Portal de los 7 Arcángeles
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleSacredAudio}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs sm:text-sm font-medium transition-all ${
                isAudioActive
                  ? "border-amber-400 bg-amber-400/20 text-amber-200 shadow-[0_0_25px_rgba(245,215,127,0.4)]"
                  : "border-white/15 bg-white/5 text-slate-300 hover:border-amber-400/40 hover:text-white"
              }`}
            >
              {isAudioActive ? <Volume2 size={16} className="text-amber-300 animate-bounce" /> : <VolumeX size={16} />}
              <span>Frecuencia 528 Hz {isAudioActive ? "Activa" : ""}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Experience */}
      <main className="relative z-10">
        <ArchangelPortal />
      </main>

      {/* Footer */}
      <footer className="relative z-20 border-t border-white/[0.06] py-8 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Kit de Herramientas Holísticas & Acústicas · Sintonización Sagrada</p>
          <div className="flex items-center gap-2 text-amber-300/80">
            <ShieldCheck size={14} />
            <span>Sintonización Energética Libre & Universal</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
