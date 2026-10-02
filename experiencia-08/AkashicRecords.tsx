"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Sparkles,
  Lock,
  Unlock,
  Volume2,
  VolumeX,
  Compass,
  CheckCircle2,
  Copy,
  ChevronRight,
  ShieldCheck,
  RotateCcw
} from "lucide-react";

export interface SoulChapter {
  id: string;
  title: string;
  theme: string;
  eterealQuery: string;
  channeledMessage: string;
  keyInsight: string;
  prescribedPractice: string;
}

export const AKASHIC_CHAPTERS: SoulChapter[] = [
  {
    id: "proposito",
    title: "Misión del Alma y Servicio",
    theme: "Semillas Estelares & Propósito",
    eterealQuery: "¿Cuál es el núcleo del servicio que mi alma vino a anclar en la Tierra?",
    channeledMessage: "Tu alma no vino a encajar en moldes prefabricados, sino a actuar como un faro de coherencia emocional. Toda herida de incomprensión en tu juventud fue un entrenamiento para desarrollar tu empatía lúcida. Tu misión es ser un puente entre la sabiduría intuitiva y la acción práctica.",
    keyInsight: "El servicio no es sacrificio; es el desborde natural de tu propia plenitud.",
    prescribedPractice: "Dedica 10 minutos cada amanecer a preguntarle a tu corazón: '¿Cómo puedo irradiar paz hoy sin desgastarme?'"
  },
  {
    id: "contratos",
    title: "Lazos Kármicos y Contratos de Alma",
    theme: "Transmutación de Vínculos",
    eterealQuery: "¿Qué lecciones encierran los vínculos desafiantes de mi presente?",
    channeledMessage: "Aquellas almas con quienes has sentido mayor fricción aceptaron antes de encarnar el papel de maestros espejo. Han venido a pulsar tus heridas de desvalorización para que elijas, por fin, amarte incondicionalmente. El contrato ha cumplido su propósito: es hora de liberarlo desde la gratitud.",
    keyInsight: "Perdonar no es justificar la conducta ajena, sino disolver el lazo que te ataba al dolor.",
    prescribedPractice: "Visualiza a esa persona envuelta en luz dorada y decreta: 'Te libero de mis expectativas; me libero de tu juicio. Gracias por la lección.'"
  },
  {
    id: "dones",
    title: "Dones y Sabiduría Ancestral",
    theme: "Memoria del Origen",
    eterealQuery: "¿Qué dones de encarnaciones pasadas están listos para despertar?",
    channeledMessage: "Portas en tu ADN cuántico el don de la palabra sanadora y la alquimia de la presencia. Tienes la facultad de calmar tormentas en otros simplemente permaneciendo en tu eje. Sientes el dolor de la Tierra porque eres guardián de su belleza. Confía en las corazonadas inmediatas antes de que la mente analítica intervenga.",
    keyInsight: "Tus dones no se aprenden de cero: se recuerdan al despejar el miedo.",
    prescribedPractice: "Crea arte, escribe o habla desde la intuición pura sin juzgar el resultado formal."
  },
  {
    id: "linaje",
    title: "Sanación del Árbol y Linaje",
    theme: "Epigenética Espiritual",
    eterealQuery: "¿Qué memoria ancestral está lista para ser transmutada por mí?",
    channeledMessage: "Eres el fruto soñado de tus ancestros: aquel miembro del clan que tiene el coraje de romper pactos de silencio, escasez o sumisión. Cuando tú te sanas y dices 'basta' a la violencia o al abandono, siete generaciones hacia atrás encuentran descanso y siete hacia adelante reciben libertad.",
    keyInsight: "Tú eres la respuesta a las oraciones de tus abuelos.",
    prescribedPractice: "Enciende una luz a tus ancestros y diles: 'Tomo su fuerza para vivir, y dejo con ustedes su dolor. Honro sus destinos viviendo en dicha.'"
  }
];

export function AkashicRecords() {
  const [isOpened, setIsOpened] = useState(false);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [copied, setCopied] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

  const playChimeTone = () => {
    if (isAudioMuted) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = audioCtxRef.current || new AudioCtx();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(963, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 4.0);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 4.2);
    } catch (e) {}
  };

  const handleOpenRecords = () => {
    setIsOpened(true);
    playChimeTone();
  };

  const handleCloseRecords = () => {
    setIsOpened(false);
  };

  const currentChapter = AKASHIC_CHAPTERS[activeChapterIndex];

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-4 space-y-8 text-[#F8F9FA]">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold tracking-widest uppercase">
          <BookOpen size={14} className="text-indigo-400" />
          <span>Biblioteca Cuántica del Alma</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-sacred font-bold text-white tracking-wide">
          Acceso a los Registros Akáshicos
        </h2>
        <p className="text-xs sm:text-sm text-stone-300 font-sans">
          Sintoniza con el campo akáshico unificado a través de la Oración del Sendero. Consulta las memorias, contratos y propósitos trascendentes de tu libro etérico.
        </p>
      </div>

      {!isOpened ? (
        /* Vista de Preparación: Rito de Entrada y Oración del Sendero */
        <div className="max-w-2xl mx-auto p-6 sm:p-10 rounded-3xl border border-indigo-500/25 bg-gradient-to-b from-[#140F22]/90 via-[#0E0A1A]/95 to-[#07050E] shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full border border-indigo-400/40 bg-indigo-500/10 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(99,102,241,0.3)]">
            <Lock className="w-7 h-7 text-indigo-300 animate-pulse" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-sacred font-bold text-white">
              Oración Sagrada del Sendero
            </h3>
            <p className="text-xs text-indigo-300/80 font-mono uppercase tracking-widest">
              Apertura del Registro Etérico Personal
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.02] text-xs sm:text-sm text-stone-300 italic font-editorial leading-relaxed max-w-xl mx-auto">
            "Pido a Dios, a la Fuente Una y a los Maestros, Guías y Seres Queridos que me permitan acceder a la dimensión del Akasha. Que mis ojos espirituales vean con compasión, que mis oídos escuchen la verdad del corazón y que cualquier sabiduría recibida sea para mi mayor bien y el de todos los seres involucrados. Que los Registros estén ahora abiertos."
          </div>

          <div className="pt-2">
            <button
              onClick={handleOpenRecords}
              className="px-8 py-3 rounded-full border border-indigo-400 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-sacred font-bold text-sm tracking-wider flex items-center gap-2 mx-auto hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(99,102,241,0.4)] cursor-pointer"
            >
              <Unlock size={18} />
              <span>Abrir mis Registros Akáshicos</span>
            </button>
          </div>
        </div>
      ) : (
        /* Vista de Registros Abiertos: El Libro de la Vida */
        <div className="space-y-6">
          {/* Barra de Navegación del Libro */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-indigo-500/20 bg-[#100B1C]/90 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-mono font-semibold text-indigo-200">
                Registros Akáshicos Activos · Canal 963 Hz
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsAudioMuted(!isAudioMuted)}
                className="p-2 rounded-xl border border-white/10 bg-white/5 text-stone-300 hover:text-white transition-all cursor-pointer"
              >
                {isAudioMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
              </button>

              <button
                onClick={handleCloseRecords}
                className="px-4 py-2 rounded-xl border border-white/15 bg-white/5 text-stone-300 text-xs font-semibold hover:border-white/30 transition-all cursor-pointer"
              >
                Cerrar Registros con Gratitud
              </button>
            </div>
          </div>

          {/* Grid: Capítulos a la izquierda, Contenido a la derecha */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Lista de Capítulos (4 cols) */}
            <div className="lg:col-span-4 space-y-2">
              {AKASHIC_CHAPTERS.map((chap, idx) => {
                const isSelected = activeChapterIndex === idx;
                return (
                  <button
                    key={chap.id}
                    onClick={() => {
                      setActiveChapterIndex(idx);
                      playChimeTone();
                    }}
                    className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? "border-indigo-400 bg-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.3)] text-white"
                        : "border-white/10 bg-[#120D20]/60 text-stone-300 hover:border-white/20"
                    }`}
                  >
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-300">
                        Capítulo 0{idx + 1}
                      </span>
                      <h4 className="text-sm font-sacred font-bold block mt-0.5">
                        {chap.title}
                      </h4>
                      <p className="text-[11px] text-stone-400 mt-1 font-sans">
                        {chap.theme}
                      </p>
                    </div>
                    <ChevronRight size={16} className={isSelected ? "text-indigo-300" : "text-stone-600"} />
                  </button>
                );
              })}
            </div>

            {/* Contenido Canalizado del Capítulo (8 cols) */}
            <div className="lg:col-span-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentChapter.id}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  className="p-6 sm:p-8 rounded-3xl border border-indigo-400/30 bg-gradient-to-b from-[#170E28] via-[#0F0A1C] to-[#080510] shadow-2xl space-y-6"
                >
                  <div className="border-b border-white/10 pb-4">
                    <span className="text-xs font-mono text-indigo-300 uppercase tracking-widest">
                      Consulta Trascendente
                    </span>
                    <h3 className="text-xl sm:text-2xl font-sacred font-bold text-white mt-1">
                      "{currentChapter.eterealQuery}"
                    </h3>
                  </div>

                  {/* Mensaje Canalizado */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                      <Sparkles size={13} />
                      Respuesta del Campo Akáshico
                    </span>
                    <p className="text-sm text-stone-200 font-sans leading-relaxed p-4 rounded-2xl border border-white/[0.08] bg-white/[0.02]">
                      {currentChapter.channeledMessage}
                    </p>
                  </div>

                  {/* Núcleo de Revelación */}
                  <div className="p-4 rounded-2xl border border-indigo-400/30 bg-indigo-500/10 space-y-1">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-indigo-300">
                      Verdad Esencial
                    </span>
                    <p className="text-sm font-editorial italic text-indigo-100">
                      "{currentChapter.keyInsight}"
                    </p>
                  </div>

                  {/* Práctica Sugerida */}
                  <div className="p-4 rounded-2xl border border-white/10 bg-[#0E0918] space-y-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <Compass size={13} />
                      Prescripción Somática de Integración
                    </span>
                    <p className="text-xs text-stone-300 leading-relaxed font-sans">
                      {currentChapter.prescribedPractice}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AkashicRecords;
