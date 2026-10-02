"use client";

import React from "react";
import { SolfeggioCymaticsTuner } from "./SolfeggioCymaticsTuner";
import { Sparkles, Radio, ShieldCheck } from "lucide-react";

export function App() {
  return (
    <div className="relative min-h-screen bg-[#040508] text-[#F8F9FA] overflow-x-hidden selection:bg-sky-400/30 selection:text-sky-200">
      {/* Header Sagrado */}
      <header className="relative z-50 w-full pt-6 pb-4 px-4 sm:px-8 border-b border-white/[0.06] bg-[#090A10]/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500/20 via-indigo-500/20 to-amber-500/20 border border-sky-400/40 flex items-center justify-center shadow-[0_0_20px_rgba(14,165,233,0.25)]">
              <Radio className="w-5 h-5 text-sky-300 animate-pulse" />
            </div>
            <div>
              <span className="block text-xs uppercase tracking-[0.28em] text-sky-400 font-sans font-semibold">
                Kit de Herramientas Holísticas · Experiencia 03
              </span>
              <h1 className="text-xl sm:text-2xl font-sacred font-bold text-white tracking-wider">
                Sintonizador Solfeggio Cimático
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-amber-300 border border-amber-400/30 bg-amber-400/10 px-3.5 py-1.5 rounded-full">
            <Sparkles size={14} />
            <span className="hidden sm:inline">Acústica Sagrada & Patrones de Chladni</span>
            <span className="sm:hidden">Acústica Sagrada</span>
          </div>
        </div>
      </header>

      {/* Main Experience */}
      <main className="relative z-10 py-10 px-4 sm:px-6 lg:px-8">
        <SolfeggioCymaticsTuner />
      </main>

      {/* Footer */}
      <footer className="relative z-20 border-t border-white/[0.06] py-8 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Kit de Herramientas Holísticas & Acústicas · Frecuencias Sagradas</p>
          <div className="flex items-center gap-2 text-sky-300/80">
            <ShieldCheck size={14} />
            <span>Frecuencias Puras de Resonancia Universal</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
