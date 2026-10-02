"use client";

import React, { useState, useRef } from "react";
import { ChakraEnergyMap, CHAKRAS_DATA } from "./ChakraEnergyMap";
import { Sparkles, Volume2, VolumeX, ShieldCheck, HeartHandshake } from "lucide-react";

export function App() {
  const [activeFrequency, setActiveFrequency] = useState<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const toggleFrequency = (hz: number) => {
    if (activeFrequency === hz) {
      if (oscRef.current) {
        try {
          oscRef.current.stop();
          oscRef.current.disconnect();
        } catch (e) {}
        oscRef.current = null;
      }
      setActiveFrequency(null);
    } else {
      if (oscRef.current) {
        try {
          oscRef.current.stop();
          oscRef.current.disconnect();
        } catch (e) {}
        oscRef.current = null;
      }
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(hz, ctx.currentTime);

        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 1.5);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();

        oscRef.current = osc;
        gainRef.current = gain;
        setActiveFrequency(hz);
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
                Kit de Herramientas Holísticas · Experiencia 02
              </span>
              <h1 className="text-xl sm:text-2xl font-sacred font-bold text-white tracking-wider">
                Mapa Interactivo de Chakras
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleFrequency(528)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs sm:text-sm font-medium transition-all ${
                activeFrequency === 528
                  ? "border-amber-400 bg-amber-400/20 text-amber-200 shadow-[0_0_25px_rgba(245,215,127,0.4)]"
                  : "border-white/15 bg-white/5 text-slate-300 hover:border-amber-400/40 hover:text-white"
              }`}
            >
              {activeFrequency === 528 ? <Volume2 size={16} className="text-amber-300 animate-bounce" /> : <VolumeX size={16} />}
              <span>Frecuencia 528 Hz {activeFrequency === 528 ? "Activa" : ""}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Experience */}
      <main className="relative z-10 py-10 px-4 sm:px-6 lg:px-8">
        <ChakraEnergyMap
          onChakraSelect={(chakra) => {
            const hzMatch = chakra.frequency.match(/(\d+)\s*Hz/);
            if (hzMatch && hzMatch[1]) {
              toggleFrequency(parseInt(hzMatch[1], 10));
            }
          }}
        />
      </main>

      {/* Footer */}
      <footer className="relative z-20 border-t border-white/[0.06] py-8 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Kit de Herramientas Holísticas & Acústicas · Sabiduría Sagrada</p>
          <div className="flex items-center gap-2 text-amber-300/80">
            <ShieldCheck size={14} />
            <span>Alineación Energética Certificada</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
