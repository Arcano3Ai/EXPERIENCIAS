"use client";

import React, { useState } from "react";
import { TibetanBowlsSanctuary } from "./TibetanBowlsSanctuary";
import { SomaticRainstick } from "../experiencia-19/SomaticRainstick";
import { Sparkles, ShieldCheck, Disc, Droplets } from "lucide-react";

export function App() {
  const [activeTab, setActiveTab] = useState<"cuencos" | "palolluvia">("cuencos");

  return (
    <div className="relative min-h-screen bg-[#0F0A05] text-[#F8F9FA] overflow-x-hidden selection:bg-amber-500/30 selection:text-amber-200">
      {/* Header Sagrado con Selector Rápido de Experiencias */}
      <header className="relative z-50 w-full pt-4 pb-3 px-4 sm:px-8 border-b border-white/[0.06] bg-[#160E07]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600/30 via-yellow-500/20 to-stone-800/40 border border-amber-400/40 flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.25)]">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <span className="block text-[11px] uppercase tracking-[0.25em] text-amber-400 font-sans font-semibold">
                Nexos Estelares · Suite Mística
              </span>
              <h1 className="text-lg sm:text-xl font-sacred font-bold text-white tracking-wider">
                {activeTab === "cuencos" ? "Santuario de Cuencos Tibetanos" : "Palo de Lluvia Somático"}
              </h1>
            </div>
          </div>

          {/* Selector de Experiencias en Pestañas Elegantes */}
          <div className="flex items-center p-1 rounded-full border border-amber-400/30 bg-[#0F0A05]/80 backdrop-blur-md shadow-inner">
            <button
              onClick={() => setActiveTab("cuencos")}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                activeTab === "cuencos"
                  ? "bg-gradient-to-r from-amber-600/80 to-amber-700/80 text-white shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                  : "text-stone-300 hover:text-white"
              }`}
            >
              <Disc size={14} className="text-amber-300" />
              <span>🪔 Cuencos Tibetanos</span>
            </button>

            <button
              onClick={() => setActiveTab("palolluvia")}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                activeTab === "palolluvia"
                  ? "bg-gradient-to-r from-amber-600/80 to-amber-700/80 text-white shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                  : "text-stone-300 hover:text-white"
              }`}
            >
              <Droplets size={14} className="text-amber-300" />
              <span>🎋 Palo de Lluvia</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Experience Render */}
      <main className="relative z-10">
        {activeTab === "cuencos" ? (
          <div className="py-8 px-4 sm:px-6 lg:px-8">
            <TibetanBowlsSanctuary />
          </div>
        ) : (
          <div className="w-full h-[calc(100vh-80px)]">
            <SomaticRainstick />
          </div>
        )}
      </main>

      {/* Footer */}
      {activeTab === "cuencos" && (
        <footer className="relative z-20 border-t border-white/[0.06] py-6 text-center text-xs text-stone-400">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© {new Date().getFullYear()} Nexos Estelares · Acústica Sagrada & Terapia Sonora</p>
            <div className="flex items-center gap-2 text-amber-300/80">
              <ShieldCheck size={14} />
              <span>Frecuencias Puras de Sanación por Resonancia</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;
