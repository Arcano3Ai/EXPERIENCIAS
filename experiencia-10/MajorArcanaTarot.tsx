"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  Sparkles,
  RotateCcw,
  Volume2,
  VolumeX,
  Eye,
  CheckCircle2,
  Compass,
  ArrowRight,
  ShieldCheck
} from "lucide-react";

export interface TarotCard {
  id: number;
  roman: string;
  name: string;
  element: string;
  lightKeywords: string[];
  shadowKeywords: string[];
  channeledMessage: string;
  prescription: string;
  colorHex: string;
  bgGrad: string;
}

export const MAJOR_ARCANA: TarotCard[] = [
  {
    id: 0,
    roman: "0",
    name: "El Loco",
    element: "Aire 💨",
    lightKeywords: ["Confianza ciega", "Nuevo inicio", "Inocencia", "Salto de fe"],
    shadowKeywords: ["Imprudencia", "Negligencia", "Falta de límites"],
    channeledMessage: "El universo te pide que des el salto sin esperar todas las garantías. Tu alma anhela aventura y frescura.",
    prescription: "Abandona el control mental por un día y di que sí a lo espontáneo.",
    colorHex: "#38BDF8",
    bgGrad: "from-sky-950 to-stone-950"
  },
  {
    id: 1,
    roman: "I",
    name: "El Mago",
    element: "Mercurio / Aire-Fuego",
    lightKeywords: ["Manifestación", "Talentos", "Fuerza creadora", "Canalización"],
    shadowKeywords: ["Manipulación", "Ilusión", "Talento desperdiciado"],
    channeledMessage: "Tienes todas las herramientas sobre tu mesa: fuego de voluntad, agua de intuición, aire de intelecto y tierra de disciplina.",
    prescription: "Materializa esa idea que llevas postergando; la magia está en la acción presente.",
    colorHex: "#F59E0B",
    bgGrad: "from-amber-950 to-stone-950"
  },
  {
    id: 2,
    roman: "II",
    name: "La Sacerdotisa",
    element: "Luna / Agua 💧",
    lightKeywords: ["Intuición profunda", "Misterio", "Silencio fértil", "Conexión psíquica"],
    shadowKeywords: ["Secretismo", "Frialdad", "Desconexión del cuerpo"],
    channeledMessage: "No busques respuestas en el ruido exterior. Escucha el susurro tenue entre tus pensamientos.",
    prescription: "Guarda silencio durante una tarde, enciende una vela y anota tus sueños lúcidos.",
    colorHex: "#818CF8",
    bgGrad: "from-indigo-950 to-stone-950"
  },
  {
    id: 3,
    roman: "III",
    name: "La Emperatriz",
    element: "Venus / Tierra 🌸",
    lightKeywords: ["Abundancia", "Creatividad", "Placer sensorial", "Fertilidad"],
    shadowKeywords: ["Asfixia afectiva", "Vanidad", "Dependencia"],
    channeledMessage: "La Madre Divina bendice tu mundo material. Honra tu belleza, goza de tus sentidos y da a luz tus proyectos con ternura.",
    prescription: "Cocina un banquete saludable para ti o camina descalzo sobre el pasto verde.",
    colorHex: "#EC4899",
    bgGrad: "from-pink-950 to-stone-950"
  },
  {
    id: 4,
    roman: "IV",
    name: "El Emperador",
    element: "Aries / Fuego 🔥",
    lightKeywords: ["Estructura", "Liderazgo", "Límites claros", "Protección"],
    shadowKeywords: ["Rigidez", "Tiranía", "Miedo al caos"],
    channeledMessage: "Es momento de poner orden en tu reino. Traza límites saludables sin pedir disculpas.",
    prescription: "Organiza tus finanzas y tus tiempos de trabajo con disciplina amorosa.",
    colorHex: "#EF4444",
    bgGrad: "from-red-950 to-stone-950"
  },
  {
    id: 8,
    roman: "VIII",
    name: "La Fuerza",
    element: "Leo / Fuego 🔥",
    lightKeywords: ["Compasión", "Dominio del ego", "Amor paciente", "Valentía"],
    shadowKeywords: ["Fuerza bruta", "Represión de la rabia", "Inseguridad"],
    channeledMessage: "No domarás al león de tus pasiones con látigos, sino acariciando su melena con ternura y firmeza.",
    prescription: "Abraza tu emoción más incómoda como si fuera un niño pequeño que necesita consuelo.",
    colorHex: "#F97316",
    bgGrad: "from-orange-950 to-stone-950"
  },
  {
    id: 9,
    roman: "IX",
    name: "El Ermitaño",
    element: "Virgo / Tierra 🕯️",
    lightKeywords: ["Introspección", "Lámpara interior", "Sabiduría", "Retiro consciente"],
    shadowKeywords: ["Aislamiento amargo", "Soberbia intelectual", "Misantropía"],
    channeledMessage: "Tu propia luz es suficiente para dar el siguiente paso en la penumbra. No necesitas ver toda la escalera.",
    prescription: "Desconecta tus redes sociales por 24 horas y escucha tu propia voz interior.",
    colorHex: "#EAB308",
    bgGrad: "from-yellow-950 to-stone-950"
  },
  {
    id: 10,
    roman: "X",
    name: "La Rueda de la Fortuna",
    element: "Júpiter / Éter 🎡",
    lightKeywords: ["Ciclos cósmicos", "Karma positivo", "Sincronicidad", "Evolución"],
    shadowKeywords: ["Resistencia al cambio", "Fatalismo", "Aferramiento"],
    channeledMessage: "Nada es permanente; las olas que bajan siempre vuelven a subir. Permanece en el centro sereno del eje.",
    prescription: "Confía en los giros inesperados del destino; te están llevando al lugar correcto.",
    colorHex: "#14B8A6",
    bgGrad: "from-teal-950 to-stone-950"
  },
  {
    id: 14,
    roman: "XIV",
    name: "La Templanza",
    element: "Sagitario / Fuego-Agua 🕊️",
    lightKeywords: ["Alquimia interna", "Moderación", "Paciencia angélica", "Armonía"],
    shadowKeywords: ["Excesos", "Impaciencia", "Falta de balance"],
    channeledMessage: "Tu ángel guardián vierte agua de una copa a otra mezclando tus opuestos en néctar de vida.",
    prescription: "Bebe un vaso de agua bendecida con tus manos en gratitud por tu sanación.",
    colorHex: "#06B6D4",
    bgGrad: "from-cyan-950 to-stone-950"
  },
  {
    id: 17,
    roman: "XVII",
    name: "La Estrella",
    element: "Acuario / Aire-Agua ⭐",
    lightKeywords: ["Esperanza radiante", "Fe restaurada", "Inspiración divina", "Generosidad"],
    shadowKeywords: ["Desesperanza", "Pesimismo", "Desconexión espiritual"],
    channeledMessage: "La tormenta ha pasado. El cielo despejado te muestra la estrella que guía tu destino con dulzura.",
    prescription: "Mira al cielo nocturno y decreta en voz alta tres deseos para tu alma.",
    colorHex: "#60A5FA",
    bgGrad: "from-blue-950 to-stone-950"
  },
  {
    id: 18,
    roman: "XVIII",
    name: "La Luna",
    element: "Piscis / Agua Profunda 🌙",
    lightKeywords: ["Sueños lúcidos", "Sombra transmutada", "Instinto animal", "Misterio"],
    shadowKeywords: ["Miedos irracionales", "Confusión", "Engaño mental"],
    channeledMessage: "Camina a través de la noche sin temerle a las sombras del camino. Lo que temes es tu propio poder dormido.",
    prescription: "Escribe tus temores en una hoja y luego quémala a la luz de una vela.",
    colorHex: "#A855F7",
    bgGrad: "from-purple-950 to-stone-950"
  },
  {
    id: 19,
    roman: "XIX",
    name: "El Sol",
    element: "Sol / Fuego Radiante ☀️",
    lightKeywords: ["Claridad absoluta", "Alegría infantil", "Vitalidad", "Éxito total"],
    shadowKeywords: ["Ego inflado", "Deslumbramiento", "Sobreexposición"],
    channeledMessage: "Las sombras se disipan bajo el resplandor de la verdad. Celébrate con inocencia y alegría.",
    prescription: "Toma un baño de sol matutino durante 10 minutos sonriendo con el pecho abierto.",
    colorHex: "#FBBF24",
    bgGrad: "from-amber-900 to-stone-950"
  },
  {
    id: 21,
    roman: "XXI",
    name: "El Mundo",
    element: "Saturno / Los 4 Elementos 🌍",
    lightKeywords: ["Culminación triunfal", "Integración total", "Totalidad", "Celebración"],
    shadowKeywords: ["Incompletitud", "Estancamiento en la meta", "Miedo al cierre"],
    channeledMessage: "Has completado un ciclo iniciático monumental. La danza cósmica te recibe en su centro de perfección.",
    prescription: "Agradece todo lo vivido hasta hoy; estás listo para tu siguiente espiral evolutiva.",
    colorHex: "#10B981",
    bgGrad: "from-emerald-950 to-stone-950"
  }
];

export interface DrawnSpreadCard {
  position: "Raíz Subconsciente" | "Punto de Poder Presente" | "Integración Futura";
  card: TarotCard;
  isFlipped: boolean;
}

export function MajorArcanaTarot() {
  const [spread, setSpread] = useState<DrawnSpreadCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<TarotCard | null>(null);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);

  const playCardChime = () => {
    if (isAudioMuted) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = audioCtxRef.current || new AudioCtx();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(639, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(852, ctx.currentTime + 1.2);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.07, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.0);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 2.2);
    } catch (e) {}
  };

  const handleShuffleAndDraw = () => {
    setIsShuffling(true);
    setSelectedCard(null);

    setTimeout(() => {
      // Tomar 3 cartas aleatorias únicas
      const shuffled = [...MAJOR_ARCANA].sort(() => 0.5 - Math.random());
      const newSpread: DrawnSpreadCard[] = [
        {
          position: "Raíz Subconsciente",
          card: shuffled[0],
          isFlipped: false
        },
        {
          position: "Punto de Poder Presente",
          card: shuffled[1],
          isFlipped: false
        },
        {
          position: "Integración Futura",
          card: shuffled[2],
          isFlipped: false
        }
      ];
      setSpread(newSpread);
      setIsShuffling(false);
      playCardChime();
    }, 1200);
  };

  const handleFlipCard = (index: number) => {
    setSpread((prev) =>
      prev.map((item, idx) => {
        if (idx === index) {
          const nextFlipped = !item.isFlipped;
          if (nextFlipped) {
            setSelectedCard(item.card);
            playCardChime();
          }
          return { ...item, isFlipped: nextFlipped };
        }
        return item;
      })
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-4 space-y-8 text-[#F8F9FA]">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-pink-500/30 bg-pink-500/10 text-pink-300 text-xs font-semibold tracking-widest uppercase">
          <Layers size={14} className="text-pink-400" />
          <span>Espejo Arquetípico & Oráculo</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-sacred font-bold text-white tracking-wide">
          Tarot de los Arcanos Mayores
        </h2>
        <p className="text-xs sm:text-sm text-stone-300 font-sans">
          Baraja los 22 Arcanos y realiza la Tirada de los Tres Espejos (Pasado, Presente y Futuro) para recibir la guía terapéutica de tu alma.
        </p>
      </div>

      {/* Botón de Barajar */}
      <div className="flex flex-wrap items-center justify-between gap-4 max-w-3xl mx-auto p-4 rounded-2xl border border-white/10 bg-[#120C14]/80 backdrop-blur-md">
        <div className="text-xs text-stone-300">
          Tirada de los Tres Espejos: <span className="text-amber-300 font-semibold">Raíz, Poder y Porvenir</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            className="p-2 rounded-xl border border-white/10 bg-white/5 text-stone-300 hover:text-white transition-all cursor-pointer"
          >
            {isAudioMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>

          <button
            onClick={handleShuffleAndDraw}
            disabled={isShuffling}
            className="px-5 py-2.5 rounded-full border border-amber-400 bg-gradient-to-r from-amber-600 to-amber-700 text-white text-xs font-semibold flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg cursor-pointer disabled:opacity-50"
          >
            <RotateCcw size={15} className={isShuffling ? "animate-spin" : ""} />
            <span>{isShuffling ? "Barajando los Arcanos..." : "Barajar y Tirar 3 Cartas"}</span>
          </button>
        </div>
      </div>

      {/* Tapete Sagrado de Tirada */}
      <div className="max-w-5xl mx-auto p-6 sm:p-10 rounded-3xl border border-amber-500/25 bg-gradient-to-b from-[#180F1D]/90 via-[#100A14]/95 to-[#050306] shadow-2xl">
        {spread.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <div className="w-16 h-16 rounded-full border border-amber-400/30 bg-amber-400/10 flex items-center justify-center mx-auto shadow-inner">
              <Sparkles className="w-7 h-7 text-amber-300 animate-pulse" />
            </div>
            <p className="text-sm font-sacred text-stone-300">
              El mazo está consagrado y en reposo sobre el tapete de terciopelo.
            </p>
            <button
              onClick={handleShuffleAndDraw}
              className="px-6 py-2.5 rounded-full border border-amber-400/50 bg-amber-400/20 text-amber-200 text-xs font-semibold hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              Comenzar Tirada
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {spread.map((item, index) => {
              return (
                <div key={index} className="flex flex-col items-center space-y-3">
                  <span className="text-xs font-mono uppercase tracking-widest text-amber-300/90 font-semibold">
                    {item.position}
                  </span>

                  {/* Carta Interactiva */}
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    onClick={() => handleFlipCard(index)}
                    className="w-48 h-80 rounded-2xl border-2 border-amber-400/40 relative cursor-pointer select-none overflow-hidden shadow-2xl transition-all perspective-1000"
                  >
                    {!item.isFlipped ? (
                      /* Reverso de la carta: Geometría sagrada dorada */
                      <div className="w-full h-full bg-gradient-to-b from-[#180C24] via-[#10071A] to-[#08030E] flex flex-col items-center justify-center p-4 border border-amber-400/30">
                        <div className="w-full h-full border border-dashed border-amber-400/40 rounded-xl flex flex-col items-center justify-center space-y-3">
                          <Sparkles className="w-8 h-8 text-amber-300 animate-spin" />
                          <span className="text-[10px] font-sacred uppercase tracking-[0.2em] text-amber-300">
                            Arcanos Mayores
                          </span>
                          <span className="text-[11px] text-stone-400 font-sans">
                            Toca para voltear
                          </span>
                        </div>
                      </div>
                    ) : (
                      /* Anverso de la carta revelada */
                      <motion.div
                        initial={{ rotateY: 90 }}
                        animate={{ rotateY: 0 }}
                        transition={{ duration: 0.35 }}
                        className={`w-full h-full bg-gradient-to-b ${item.card.bgGrad} flex flex-col justify-between p-4 border-2 border-amber-400 shadow-inner`}
                      >
                        <div className="flex items-center justify-between border-b border-amber-400/30 pb-1.5">
                          <span className="text-xs font-mono font-bold text-amber-300">
                            {item.card.roman}
                          </span>
                          <span className="text-[10px] text-stone-300">
                            {item.card.element}
                          </span>
                        </div>

                        <div className="text-center my-auto space-y-2">
                          <div className="w-12 h-12 rounded-full border border-amber-400/40 bg-amber-400/10 flex items-center justify-center mx-auto">
                            <Sparkles className="w-6 h-6 text-amber-300" />
                          </div>
                          <h4 className="text-base font-sacred font-bold text-white">
                            {item.card.name}
                          </h4>
                          <div className="flex flex-wrap justify-center gap-1">
                            {item.card.lightKeywords.slice(0, 2).map((k, i) => (
                              <span key={i} className="text-[9px] px-2 py-0.5 rounded-md bg-white/10 text-amber-200">
                                {k}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="border-t border-amber-400/30 pt-1.5 text-center">
                          <span className="text-[10px] text-amber-300/80 font-mono">
                            Ver Interpretación
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detalle Interpretativo de la Carta Seleccionada */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl border border-amber-400/35 bg-gradient-to-b from-[#1C1124] to-[#0D0812] shadow-2xl space-y-5"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-base font-mono font-bold px-3 py-1 rounded-xl border border-amber-400/40 bg-amber-400/15 text-amber-300">
                  {selectedCard.roman}
                </span>
                <div>
                  <h3 className="text-xl sm:text-2xl font-sacred font-bold text-white">
                    {selectedCard.name}
                  </h3>
                  <p className="text-xs text-amber-300 font-sans">
                    Elemento: {selectedCard.element}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCard(null)}
                className="text-xs text-stone-400 hover:text-white px-3 py-1 rounded-lg border border-white/10"
              >
                Cerrar
              </button>
            </div>

            {/* Canalización Oracular */}
            <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] space-y-1">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-amber-300 block">
                Mensaje del Oráculo:
              </span>
              <p className="text-sm text-stone-200 font-sans leading-relaxed">
                "{selectedCard.channeledMessage}"
              </p>
            </div>

            {/* Palabras Clave de Luz y Sombra */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5 p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
                <span className="font-semibold text-emerald-400 block">✦ En su Luz:</span>
                <p className="text-stone-300">{selectedCard.lightKeywords.join(", ")}</p>
              </div>
              <div className="space-y-1.5 p-3 rounded-xl border border-rose-500/20 bg-rose-500/5">
                <span className="font-semibold text-rose-400 block">✦ En su Sombra:</span>
                <p className="text-stone-300">{selectedCard.shadowKeywords.join(", ")}</p>
              </div>
            </div>

            {/* Prescripción Terapéutica */}
            <div className="p-4 rounded-2xl border border-amber-400/30 bg-amber-500/10 space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-widest text-amber-300 block">
                Prescripción del Alma
              </span>
              <p className="text-xs sm:text-sm font-editorial italic text-amber-100">
                {selectedCard.prescription}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MajorArcanaTarot;
