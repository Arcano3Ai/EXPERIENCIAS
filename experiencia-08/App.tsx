"use client";

import React from "react";
import { AkashicRecords } from "./AkashicRecords";
import { BookOpen, ShieldCheck } from "lucide-react";

export function App() {
  return (
    <div className="relative min-h-screen bg-[#07050E] text-[#F8F9FA] overflow-x-hidden selection:bg-indigo-500/30 selection:text-indigo-200">
      <header className="relative z-50 w-full pt-6 pb-4 px-4 sm:px-8 border-b border-white/[0.06] bg-[#0E0A1A]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-blue-500/20 border border-indigo-400/40 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.25)]">
              <BookOpen className="w-5 h-5 text-indigo-300 animate-pulse" />
            </div>
            <div>
              <span className="block text-xs uppercase tracking-[0.28em] text-indigo-300 font-sans font-semibold">
                Nexos Estelares · Experiencia 08
              </span>
              <h1 className="text-xl sm:text-2xl font-sacred font-bold text-white tracking-wider">
                Acceso a los Registros Akáshicos
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 py-8 px-4 sm:px-6">
        <AkashicRecords />
      </main>

      <footer className="relative z-20 border-t border-white/[0.06] py-6 text-center text-xs text-stone-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Nexos Estelares · Memoria Cuántica Universal</p>
          <div className="flex items-center gap-2 text-indigo-300/80">
            <ShieldCheck size={14} />
            <span>Biblioteca Etérica Sagrada</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
