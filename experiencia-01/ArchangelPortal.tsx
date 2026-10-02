"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Wind,
  Compass,
  Gem,
  Activity,
  Flame,
  Shield,
  Heart,
  Sun,
  Layers,
  Info,
  Maximize2
} from "lucide-react";

export interface Archangel {
  id: string;
  name: string;
  title: string;
  rayName: string;
  frequencyHz: number;
  chakraName: string;
  colorHex: string;
  coreGlow: string;
  palette: string[];
  symbol: "sword" | "caduceus" | "trumpet" | "heart" | "flame" | "lion" | "metatron";
  virtue: string;
  crystal: string;
  element: string;
  direction: string;
  dayTime: string;
  decreeText: string;
  closingText: string;
  inhaleGuidance: string;
  exhaleGuidance: string;
}

export const ARCHANGELS: Archangel[] = [
  {
    id: "miguel",
    name: "Miguel",
    title: "CANALIZACIÓN DE MIGUEL",
    rayName: "Rayo Azul Zafiro",
    frequencyHz: 741,
    chakraName: "Garganta & Protección Soberana",
    colorHex: "#3B82F6",
    coreGlow: "rgba(59, 130, 246, 0.85)",
    palette: ["#BFDBFE", "#60A5FA", "#3B82F6", "#1D4ED8", "#FFFFFF"],
    symbol: "sword",
    virtue: "Fuerza Divina, Coraje Inquebrantable & Corte de Lazos Kármicos",
    crystal: "Lapislázuli, Sodalita & Zafiro Azul",
    element: "Fuego Eléctrico & Éter",
    direction: "Sur",
    dayTime: "Domingo · Hora del Mediodía",
    decreeText: "invoco la presencia victoriosa del Arcángel Miguel y su espada de luz zafiro. Corto de raíz todo lazo de miedo, juicio, atadura o interferencia densa en mi campo áurico. Sello mi templo interior en la verdad primordial y camino con soberanía, valentía y fe inquebrantable.",
    closingText: "Soy fuerza, soy soberanía, soy protección divina.",
    inhaleGuidance: "Inhala la luz azul zafiro envolviendo tu pecho y garganta...",
    exhaleGuidance: "Exhala con fuerza todo lazo, temor o contrato que ya no te sirve..."
  },
  {
    id: "rafael",
    name: "Rafael",
    title: "CANALIZACIÓN DE RAFAEL",
    rayName: "Rayo Verde Esmeralda",
    frequencyHz: 528,
    chakraName: "Corazón & Sanación Regenerativa",
    colorHex: "#10B981",
    coreGlow: "rgba(16, 185, 129, 0.85)",
    palette: ["#A7F3D0", "#34D399", "#10B981", "#047857", "#FFFFFF"],
    symbol: "caduceus",
    virtue: "Regeneración Celular, Sanación Holística & Consagración de la Vida",
    crystal: "Esmeralda, Malaquita, Venturina & Jade Verde",
    element: "Aire Vital & Éter Sanador",
    direction: "Este",
    dayTime: "Miércoles · Al Amanecer",
    decreeText: "abro cada célula, órgano, tejido y memoria emocional al bálsamo esmeralda de Rafael. Disuelvo toda creencia de escasez de salud, restauro el diseño original de mi ADN lumínico y permito que la vitalidad infinita del Cosmos fluya por mi sistema.",
    closingText: "Soy salud perfecta, soy armonía celular, soy renovación.",
    inhaleGuidance: "Inhala el rocío esmeralda nutriendo cada mitocondria...",
    exhaleGuidance: "Exhala dolores viejos, fatiga y memorias de enfermedad..."
  },
  {
    id: "gabriel",
    name: "Gabriel",
    title: "CANALIZACIÓN DE GABRIEL",
    rayName: "Rayo Blanco Cristalino",
    frequencyHz: 852,
    chakraName: "Claridad, Pureza & Tercer Ojo",
    colorHex: "#F1F5F9",
    coreGlow: "rgba(241, 245, 249, 0.9)",
    palette: ["#FFFFFF", "#E2E8F0", "#CBD5E1", "#94A3B8", "#FEF08A"],
    symbol: "trumpet",
    virtue: "Revelación Divina, Claridad Mental, Creatividad & Verdad Expresada",
    crystal: "Selenita, Diamante Herkimer, Cuarzo Transparente & Piedra de Luna",
    element: "Agua Cristalina & Niebla Etérea",
    direction: "Oeste",
    dayTime: "Lunes · Luz de la Luna Llena",
    decreeText: "recibo la trompeta celestial y la luz diamantina del Arcángel Gabriel. Despejo toda niebla mental, abro mi percepción intuitiva a la verdad cósmica y expreso el propósito sagrado de mi alma con autenticidad y gracia pura.",
    closingText: "Soy claridad divina, soy verdad, soy luz diamantina.",
    inhaleGuidance: "Inhala la luz blanca cristalina que purifica tus pensamientos...",
    exhaleGuidance: "Exhala la confusión, el juicio mental y el ruido externo..."
  },
  {
    id: "chamuel",
    name: "Chamuel",
    title: "CANALIZACIÓN DE CHAMUEL",
    rayName: "Rayo Rosa Cuarzo",
    frequencyHz: 639,
    chakraName: "Templo del Corazón & Conexión Sagrada",
    colorHex: "#F472B6",
    coreGlow: "rgba(244, 114, 182, 0.85)",
    palette: ["#FBCFE8", "#F472B6", "#EC4899", "#BE185D", "#FFFFFF"],
    symbol: "heart",
    virtue: "Amor Incondicional, Reconciliación, Autoestima & Paz Relacional",
    crystal: "Cuarzo Rosa, Rodocrosita, Morganita & Turmalina Rosa",
    element: "Fuego Compasivo & Agua Dulce",
    direction: "Noreste",
    dayTime: "Martes · Al Crepúsculo",
    decreeText: "sumerjo mi corazón en el fuego rosa de la ternura infinita de Chamuel. Sano toda herida de rechazo, duelo o traición en mis relaciones. Me reconozco digno de amar y ser amado, proyectando devoción y compasión universal hacia todo ser viviente.",
    closingText: "Soy amor incondicional, soy ternura, soy paz en mis vínculos.",
    inhaleGuidance: "Inhala el calor cálido del cuarzo rosa en el centro de tu pecho...",
    exhaleGuidance: "Exhala resentimientos, defensas y corazas del pasado..."
  },
  {
    id: "uriel",
    name: "Uriel",
    title: "CANALIZACIÓN DE URIEL",
    rayName: "Rayo Rubí Dorado",
    frequencyHz: 417,
    chakraName: "Plexo Solar & Voluntad Creativa",
    colorHex: "#FB923C",
    coreGlow: "rgba(251, 146, 60, 0.85)",
    palette: ["#FED7AA", "#FB923C", "#EA580C", "#9A3412", "#FDE047"],
    symbol: "flame",
    virtue: "Iluminación de Sabiduría, Paz Interior, Solución de Conflictos & Discernimiento",
    crystal: "Ámbar, Ojo de Tigre, Granate, Cornalina & Rubí",
    element: "Fuego Solar & Magma Primordial",
    direction: "Norte",
    dayTime: "Jueves · Salida del Sol",
    decreeText: "recibo la antorcha sagrada y la sabiduría cósmica del Arcángel Uriel. Disuelvo la incertidumbre y el temor al futuro. Acepto la guía certera que ilumina mi sendero y confío plenamente en la sincronicidad y orden perfecto del Universo.",
    closingText: "Soy sabiduría viva, soy serenidad, soy luz en el camino.",
    inhaleGuidance: "Inhala la llama dorada y rubí llenando tu plexo de confianza...",
    exhaleGuidance: "Exhala la ansiedad, la indecisión y la impotencia..."
  },
  {
    id: "ariel",
    name: "Ariel",
    title: "CANALIZACIÓN DE ARIEL",
    rayName: "Rayo Ámbar & Abundancia",
    frequencyHz: 396,
    chakraName: "Chakra Raíz & Enraizamiento a Gaia",
    colorHex: "#EAB308",
    coreGlow: "rgba(234, 179, 8, 0.85)",
    palette: ["#FEF08A", "#FACC15", "#EAB308", "#CA8A04", "#FFFFFF"],
    symbol: "lion",
    virtue: "Prosperidad Material, Conexión con la Naturaleza & Manifestación Terrenal",
    crystal: "Citrino, Pirita, Jaspe Rojo, Cuarzo Ahumado & Ojo de Halcón",
    element: "Tierra Fértil & Bosque Ancestral",
    direction: "Noroeste",
    dayTime: "Viernes · Conexión con la Tierra",
    decreeText: "reconozco la generosidad y providencia infinita de la Madre Tierra custodiada por Ariel. Abro mis brazos para recibir la abundancia económica, creativa y espiritual en sincronía armónica. Honro mi capacidad sagrada de manifestar plenitud en este plano.",
    closingText: "Soy abundancia natural, soy gratitud infinita, soy prosperidad.",
    inhaleGuidance: "Inhala las raíces doradas que te anclan profundamente en la Tierra...",
    exhaleGuidance: "Exhala la escasez, el apego y la sensación de carencia..."
  },
  {
    id: "metatron",
    name: "Metatrón",
    title: "CANALIZACIÓN DE METATRÓN",
    rayName: "Rayo Violeta Cuántico",
    frequencyHz: 963,
    chakraName: "Corona & Ascensión Multidimensional",
    colorHex: "#A855F7",
    coreGlow: "rgba(168, 85, 247, 0.85)",
    palette: ["#F3E8FF", "#C084FC", "#A855F7", "#7E22CE", "#FDE047"],
    symbol: "metatron",
    virtue: "Geometría Sagrada, Ascensión, Registros del Alma & Activación del Merkaba",
    crystal: "Amatista Chevron, Tanzanita, Moldavita & Cuarzo Lemuriano",
    element: "Plasma Cósmico & Akasha",
    direction: "Centro / Cenit Universal",
    dayTime: "Sábado · Medianoche y Portales Cuánticos",
    decreeText: "reconozco mi divinidad interior y me enlazo a la inteligencia suprema de Metatrón. Activo el Cubo de Metatrón y mi Merkaba personal, elevando mi frecuencia electromagnética. Me alineo con la consciencia universal para encarnar mi más alto propósito cósmico.",
    closingText: "Soy consciencia pura, soy geometría divina, soy luz eterna.",
    inhaleGuidance: "Inhala la espiral violeta activando tu corona hacia las estrellas...",
    exhaleGuidance: "Exhala la ilusión de separación, fundiéndote con la Unidad..."
  }
];

// Símbolos Sagrados Vectoriales
const SacredGlyph: React.FC<{ symbol: Archangel["symbol"]; className?: string }> = ({
  symbol,
  className = "w-7 h-7"
}) => {
  switch (symbol) {
    case "sword":
      return (
        <svg viewBox="0 0 36 36" fill="none" className={className} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          <path d="M26 6 L30 10 L14 26 L10 22 Z" strokeWidth="2" fill="currentColor" fillOpacity="0.25" />
          <line x1="8" y1="24" x2="16" y2="16" strokeWidth="2.4" />
          <line x1="10" y1="26" x2="6" y2="30" strokeWidth="2.4" />
          <circle cx="5" cy="31" r="1.6" fill="currentColor" />
          <line x1="12" y1="24" x2="28" y2="8" strokeWidth="1.2" opacity="0.7" />
        </svg>
      );
    case "caduceus":
      return (
        <svg viewBox="0 0 36 36" fill="none" className={className} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="18" y2="32" strokeWidth="2.2" />
          <circle cx="18" cy="5" r="2.2" fill="currentColor" />
          <path d="M18 10 C13 7 8 8 7 12 C10 13 15 12 18 11" strokeWidth="1.8" fill="currentColor" fillOpacity="0.3" />
          <path d="M18 10 C23 7 28 8 29 12 C26 13 21 12 18 11" strokeWidth="1.8" fill="currentColor" fillOpacity="0.3" />
          <path d="M12 16 C12 13 24 13 24 18 C24 23 12 23 12 28 C12 30 18 31 18 31" strokeWidth="1.8" />
          <path d="M24 16 C24 13 12 13 12 18 C12 23 24 23 24 28 C24 30 18 31 18 31" strokeWidth="1.8" opacity="0.9" />
        </svg>
      );
    case "trumpet":
      return (
        <svg viewBox="0 0 36 36" fill="none" className={className} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          <line x1="7" y1="18" x2="24" y2="18" strokeWidth="2.2" />
          <path d="M24 16 L31 12 L31 24 L24 20 Z" strokeWidth="2" fill="currentColor" fillOpacity="0.35" />
          <ellipse cx="31" cy="18" rx="1.4" ry="5.5" strokeWidth="2" fill="currentColor" fillOpacity="0.5" />
          <rect x="6" y="16.5" width="2.2" height="3" rx="0.5" fill="currentColor" />
          <line x1="13" y1="13" x2="13" y2="18" strokeWidth="2" />
          <line x1="17" y1="13" x2="17" y2="18" strokeWidth="2" />
          <line x1="21" y1="13" x2="21" y2="18" strokeWidth="2" />
        </svg>
      );
    case "heart":
      return (
        <svg viewBox="0 0 36 36" fill="none" className={className} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          <path
            d="M18 29 C18 29 10 22 10 16.5 C10 13.5 12.5 11 15.5 11 C17 11 18 12 18 12 C18 12 19 11 20.5 11 C23.5 11 26 13.5 26 16.5 C26 22 18 29 18 29 Z"
            strokeWidth="2"
            fill="currentColor"
            fillOpacity="0.3"
          />
          <line x1="18" y1="8" x2="18" y2="11" strokeWidth="1.8" />
          <circle cx="18" cy="7" r="1.6" fill="currentColor" />
        </svg>
      );
    case "flame":
      return (
        <svg viewBox="0 0 36 36" fill="none" className={className} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 24 C14 28 22 28 22 24 L22 22 L14 22 Z" strokeWidth="1.8" fill="currentColor" fillOpacity="0.35" />
          <line x1="18" y1="28" x2="18" y2="32" strokeWidth="2" />
          <line x1="15" y1="32" x2="21" y2="32" strokeWidth="2" />
          <path
            d="M18 8 C18 8 13 14 13 17 C13 20 15 21 18 21 C21 21 23 20 23 17 C23 14 18 8 18 8 Z"
            strokeWidth="1.8"
            fill="currentColor"
            fillOpacity="0.3"
          />
        </svg>
      );
    case "lion":
      return (
        <svg viewBox="0 0 36 36" fill="none" className={className} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6 C13 6 9 9.5 8 14 C7 17.5 8 21.5 10 25 C12 28.5 15 30 18 30 C21 30 24 28.5 26 25 C28 21.5 29 17.5 28 14 C27 9.5 23 6 18 6 Z" strokeWidth="1.7" />
          <path d="M8 14 C6 16.5 6 20 8.5 23" strokeWidth="1.4" />
          <path d="M28 14 C30 16.5 30 20 27.5 23" strokeWidth="1.4" />
          <path d="M15 19 L18 22 L21 19" strokeWidth="1.8" />
          <line x1="18" y1="22" x2="18" y2="26" strokeWidth="1.8" />
          <line x1="13.5" y1="16.5" x2="16" y2="16.5" strokeWidth="2" />
          <line x1="20" y1="16.5" x2="22.5" y2="16.5" strokeWidth="2" />
        </svg>
      );
    case "metatron":
      return (
        <svg viewBox="0 0 36 36" fill="none" className={className} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="18" r="3.2" strokeWidth="1.4" fill="currentColor" fillOpacity="0.25" />
          <circle cx="18" cy="18" r="12" strokeWidth="0.9" strokeDasharray="1 2.5" opacity="0.7" />
          <polygon points="18,6 28.39,24 7.61,24" strokeWidth="1.3" opacity="0.95" />
          <polygon points="18,30 28.39,12 7.61,12" strokeWidth="1.3" opacity="0.95" />
          <polygon points="18,6 28.39,12 28.39,24 18,30 7.61,24 7.61,12" strokeWidth="1.3" />
          <circle cx="18" cy="6" r="1.8" fill="currentColor" />
          <circle cx="28.39" cy="12" r="1.8" fill="currentColor" />
          <circle cx="28.39" cy="24" r="1.8" fill="currentColor" />
          <circle cx="18" cy="30" r="1.8" fill="currentColor" />
          <circle cx="7.61" cy="24" r="1.6" fill="currentColor" />
          <circle cx="7.61" cy="12" r="1.6" fill="currentColor" />
        </svg>
      );
  }
};

export interface ArchangelPortalProps {
  className?: string;
  initialId?: string;
}

export const ArchangelPortal: React.FC<ArchangelPortalProps> = ({
  className = "",
  initialId = "metatron"
}) => {
  const [selectedId, setSelectedId] = useState<string>(initialId);
  const [activeTab, setActiveTab] = useState<"decreto" | "meditacion" | "atributos">("decreto");
  const [userName, setUserName] = useState<string>("");
  const [copiedStatus, setCopiedStatus] = useState<boolean>(false);
  const [isDroneActive, setIsDroneActive] = useState<boolean>(false);
  const [droneVolume, setDroneVolume] = useState<number>(0.15);

  // Estado para el ciclo de respiración meditativa
  const [breathPhase, setBreathPhase] = useState<"inhala" | "reten" | "exhala" | "reposo">("inhala");
  const [breathSeconds, setBreathSeconds] = useState<number>(4);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const clickWaveRef = useRef<{ active: boolean; r: number; x: number; y: number } | null>(null);

  const currentArchangel =
    ARCHANGELS.find((a) => a.id === selectedId) || ARCHANGELS[6];

  // ============================================================
  // MOTOR ACÚSTICO WEB AUDIO API (Pulsos Armónicos + Drone Solfeggio)
  // ============================================================
  const audioCtxRef = useRef<AudioContext | null>(null);
  const droneNodesRef = useRef<{
    fundamentalOsc: OscillatorNode;
    harmonicOsc: OscillatorNode;
    subOsc: OscillatorNode;
    masterGain: GainNode;
  } | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume().catch(() => {});
    }
    return audioCtxRef.current;
  }, []);

  // Tono armónico con decaimiento natural tipo campana tibetana / cristal
  const playHarmonicTone = useCallback((freq: number) => {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      [freq, freq * 1.5, freq * 2, freq * 2.75].forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = idx === 0 ? "sine" : "triangle";
        osc.frequency.setValueAtTime(f, now);

        const peakGain = (0.08 / (idx + 1)) * 0.9;
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(peakGain, now + 0.05 + idx * 0.02);
        gain.gain.exponentialRampToValueAtTime(0.00001, now + 3.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 3.3);
      });
    } catch {
      // Audio autoplay restrictions
    }
  }, [getAudioContext]);

  // Manejador del Baño Sonoro Continuo (Drone Solfeggio)
  const toggleDrone = useCallback(() => {
    const ctx = getAudioContext();

    if (isDroneActive && droneNodesRef.current) {
      // Fade out
      const { masterGain, fundamentalOsc, harmonicOsc, subOsc } = droneNodesRef.current;
      const now = ctx.currentTime;
      masterGain.gain.linearRampToValueAtTime(0.00001, now + 1.2);
      setTimeout(() => {
        try {
          fundamentalOsc.stop();
          harmonicOsc.stop();
          subOsc.stop();
          fundamentalOsc.disconnect();
          harmonicOsc.disconnect();
          subOsc.disconnect();
          masterGain.disconnect();
        } catch {}
        droneNodesRef.current = null;
      }, 1300);
      setIsDroneActive(false);
    } else {
      // Activar Drone en frequencyHz del Arcángel activo
      const now = ctx.currentTime;
      const freq = currentArchangel.frequencyHz;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.0001, now);
      masterGain.gain.linearRampToValueAtTime(droneVolume, now + 1.5);
      masterGain.connect(ctx.destination);

      // 1. Oscilador fundamental puro
      const fundamentalOsc = ctx.createOscillator();
      fundamentalOsc.type = "sine";
      fundamentalOsc.frequency.setValueAtTime(freq, now);

      // 2. Armónico sutil (quinta perfecta arriba freq * 1.5)
      const harmonicOsc = ctx.createOscillator();
      harmonicOsc.type = "sine";
      harmonicOsc.frequency.setValueAtTime(freq * 1.5, now);
      const harmGain = ctx.createGain();
      harmGain.gain.value = 0.22;
      harmonicOsc.connect(harmGain);
      harmGain.connect(masterGain);

      // 3. Sub-octava profunda (freq / 2 o freq / 4)
      const subOsc = ctx.createOscillator();
      subOsc.type = "sine";
      const subFreq = freq > 600 ? freq / 4 : freq / 2;
      subOsc.frequency.setValueAtTime(subFreq, now);
      const subGain = ctx.createGain();
      subGain.gain.value = 0.35;
      subOsc.connect(subGain);
      subGain.connect(masterGain);

      fundamentalOsc.connect(masterGain);

      fundamentalOsc.start(now);
      harmonicOsc.start(now);
      subOsc.start(now);

      droneNodesRef.current = {
        fundamentalOsc,
        harmonicOsc,
        subOsc,
        masterGain
      };
      setIsDroneActive(true);
    }
  }, [isDroneActive, getAudioContext, currentArchangel, droneVolume]);

  // Si cambia el arcángel y el drone está activo, hacer transición de frecuencia suave (portamento)
  useEffect(() => {
    if (isDroneActive && droneNodesRef.current && audioCtxRef.current) {
      const now = audioCtxRef.current.currentTime;
      const freq = currentArchangel.frequencyHz;
      const { fundamentalOsc, harmonicOsc, subOsc } = droneNodesRef.current;

      fundamentalOsc.frequency.exponentialRampToValueAtTime(freq, now + 1.2);
      harmonicOsc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 1.2);
      const subFreq = freq > 600 ? freq / 4 : freq / 2;
      subOsc.frequency.exponentialRampToValueAtTime(subFreq, now + 1.2);
    }
  }, [selectedId, currentArchangel, isDroneActive]);

  // Modificar volumen del drone
  useEffect(() => {
    if (isDroneActive && droneNodesRef.current && audioCtxRef.current) {
      const now = audioCtxRef.current.currentTime;
      droneNodesRef.current.masterGain.gain.linearRampToValueAtTime(droneVolume, now + 0.1);
    }
  }, [droneVolume, isDroneActive]);

  // Limpieza de audio al desmontar
  useEffect(() => {
    return () => {
      if (droneNodesRef.current) {
        try {
          droneNodesRef.current.fundamentalOsc.stop();
          droneNodesRef.current.harmonicOsc.stop();
          droneNodesRef.current.subOsc.stop();
        } catch {}
      }
    };
  }, []);

  // ============================================================
  // CICLO DE RESPIRACIÓN MEDITATIVA (Pacer 4-4-4-4)
  // ============================================================
  useEffect(() => {
    if (activeTab !== "meditacion") return;

    const timer = setInterval(() => {
      setBreathSeconds((prev) => {
        if (prev <= 1) {
          setBreathPhase((current) => {
            if (current === "inhala") return "reten";
            if (current === "reten") return "exhala";
            if (current === "exhala") return "reposo";
            return "inhala";
          });
          return 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeTab]);

  // ============================================================
  // MOTOR FÍSICO DE PARTÍCULAS: CANVAS RETINA & DINÁMICA DE PLASMA
  // ============================================================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;
    const size = 390;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const centerX = size / 2;
    const centerY = size / 2;
    const maxRadius = size * 0.44;

    const mouse = {
      x: -999,
      y: -999,
      prevX: -999,
      prevY: -999,
      vx: 0,
      vy: 0,
      active: false
    };

    interface CosmicParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      orbitAngle: number;
      orbitDist: number;
      baseSpeed: number;
      size: number;
      color: string;
      alpha: number;
      pulseRate: number;
      pulsePhase: number;
    }

    const particles: CosmicParticle[] = Array.from({ length: 200 }, (_, idx) => {
      const angle = (idx / 200) * Math.PI * 2 + Math.random() * 0.35;
      const dist = 18 + Math.random() * (maxRadius * 0.82);
      return {
        x: centerX + Math.cos(angle) * dist,
        y: centerY + Math.sin(angle) * dist,
        vx: 0,
        vy: 0,
        orbitAngle: angle,
        orbitDist: dist,
        baseSpeed: (Math.random() * 0.008 + 0.0035) * (idx % 2 === 0 ? 1 : -1),
        size: Math.random() < 0.2 ? Math.random() * 2 + 2.5 : Math.random() * 1.5 + 0.7,
        color: currentArchangel.palette[Math.floor(Math.random() * currentArchangel.palette.length)],
        alpha: Math.random() * 0.5 + 0.4,
        pulseRate: Math.random() * 0.04 + 0.02,
        pulsePhase: Math.random() * Math.PI * 2
      };
    });

    interface Shockwave {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      alpha: number;
      speed: number;
      color: string;
      thickness: number;
    }

    interface CosmicBurst {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      size: number;
      alpha: number;
      decay: number;
    }

    const shockwaves: Shockwave[] = [];
    const bursts: CosmicBurst[] = [];

    let returnGravity = 0.013;
    let gravityTimer: number | null = null;

    const triggerShockwave = (clickX = centerX, clickY = centerY) => {
      shockwaves.push({
        x: clickX,
        y: clickY,
        radius: 4,
        maxRadius: maxRadius * 1.3,
        alpha: 1.0,
        speed: 7.8,
        color: currentArchangel.colorHex,
        thickness: 5.5
      });

      shockwaves.push({
        x: clickX,
        y: clickY,
        radius: 1,
        maxRadius: maxRadius * 1.15,
        alpha: 0.8,
        speed: 5.2,
        color: "#FFFFFF",
        thickness: 2.8
      });

      particles.forEach((p) => {
        let dx = p.x - clickX;
        let dy = p.y - clickY;
        let dist = Math.hypot(dx, dy);

        if (dist < 4) {
          const rndAng = Math.random() * Math.PI * 2;
          dx = Math.cos(rndAng);
          dy = Math.sin(rndAng);
          dist = 1;
        }

        const force = Math.max(16, 36 * (1 - dist / (maxRadius * 1.25)));
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
      });

      for (let i = 0; i < 30; i++) {
        const ang = (i / 30) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
        const spd = Math.random() * 9 + 4.5;
        bursts.push({
          x: clickX,
          y: clickY,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          color: Math.random() > 0.35 ? "#FFFFFF" : currentArchangel.palette[Math.floor(Math.random() * currentArchangel.palette.length)],
          size: Math.random() * 2.8 + 1.2,
          alpha: 1.0,
          decay: Math.random() * 0.025 + 0.016
        });
      }

      returnGravity = 0.0035;
      if (gravityTimer) clearTimeout(gravityTimer);
      gravityTimer = window.setTimeout(() => {
        returnGravity = 0.013;
      }, 1600);
    };

    const updateMousePos = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = size / rect.width;
      const scaleY = size / rect.height;
      const canvasX = (clientX - rect.left) * scaleX;
      const canvasY = (clientY - rect.top) * scaleY;

      if (mouse.prevX !== -999) {
        mouse.vx = canvasX - mouse.prevX;
        mouse.vy = canvasY - mouse.prevY;
      }
      mouse.prevX = canvasX;
      mouse.prevY = canvasY;
      mouse.x = canvasX;
      mouse.y = canvasY;
      mouse.active = true;
    };

    const handleMouseMove = (e: MouseEvent) => updateMousePos(e.clientX, e.clientY);
    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -999;
      mouse.y = -999;
      mouse.prevX = -999;
      mouse.prevY = -999;
      mouse.vx = 0;
      mouse.vy = 0;
    };

    const handleCanvasClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = size / rect.width;
      const scaleY = size / rect.height;
      const clickX = (e.clientX - rect.left) * scaleX;
      const clickY = (e.clientY - rect.top) * scaleY;
      triggerShockwave(clickX, clickY);
      playHarmonicTone(currentArchangel.frequencyHz);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) updateMousePos(e.touches[0].clientX, e.touches[0].clientY);
    };
    const handleTouchEnd = () => handleMouseLeave();

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("click", handleCanvasClick);
    canvas.addEventListener("touchmove", handleTouchMove, { passive: true });
    canvas.addEventListener("touchend", handleTouchEnd);

    const checkExternalWave = () => {
      if (clickWaveRef.current && clickWaveRef.current.active) {
        triggerShockwave(clickWaveRef.current.x, clickWaveRef.current.y);
        clickWaveRef.current.active = false;
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, size, size);
      checkExternalWave();

      // 1. Fondo de obsidiana con profundidad estelar
      const bgGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius);
      bgGrad.addColorStop(0, `${currentArchangel.colorHex}25`);
      bgGrad.addColorStop(0.55, "#080b16");
      bgGrad.addColorStop(1, "#020306");
      ctx.fillStyle = bgGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, maxRadius, 0, Math.PI * 2);
      ctx.fill();

      // 2. Halo giratorio de plasma
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(Date.now() * 0.00035);
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.ellipse(0, 0, maxRadius * 0.74, maxRadius * 0.32, (i * Math.PI) / 3, 0, Math.PI * 2);
        ctx.strokeStyle = `${currentArchangel.colorHex}18`;
        ctx.lineWidth = 14;
        ctx.stroke();
      }
      ctx.restore();

      // 3. Shockwaves
      for (let w = shockwaves.length - 1; w >= 0; w--) {
        const sw = shockwaves[w];
        sw.radius += sw.speed;
        sw.alpha -= 0.022;

        if (sw.alpha <= 0 || sw.radius >= sw.maxRadius) {
          shockwaves.splice(w, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = sw.color;
        ctx.lineWidth = sw.thickness;
        ctx.globalAlpha = Math.max(0, sw.alpha);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(sw.x, sw.y, Math.max(1, sw.radius - 1), 0, Math.PI * 2);
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = Math.max(0, sw.alpha * 0.85);
        ctx.stroke();
        ctx.restore();
      }

      // 4. Bursts
      for (let b = bursts.length - 1; b >= 0; b--) {
        const br = bursts[b];
        br.x += br.vx;
        br.y += br.vy;
        br.vx *= 0.94;
        br.vy *= 0.94;
        br.alpha -= br.decay;

        if (br.alpha <= 0) {
          bursts.splice(b, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(br.x, br.y, br.size, 0, Math.PI * 2);
        ctx.fillStyle = br.color;
        ctx.globalAlpha = br.alpha;
        ctx.fill();
        ctx.restore();
      }

      // 5. Partículas con física de repulsión
      particles.forEach((p) => {
        p.orbitAngle += p.baseSpeed;
        const targetX = centerX + Math.cos(p.orbitAngle) * p.orbitDist;
        const targetY = centerY + Math.sin(p.orbitAngle) * p.orbitDist;

        p.vx += (targetX - p.x) * returnGravity;
        p.vy += (targetY - p.y) * returnGravity;

        if (mouse.active) {
          const mdx = p.x - mouse.x;
          const mdy = p.y - mouse.y;
          const mdist = Math.hypot(mdx, mdy);
          const repelRadius = 115;

          if (mdist < repelRadius && mdist > 0.1) {
            const ratio = 1 - mdist / repelRadius;
            const repelPower = ratio * ratio * 16;

            p.vx += (mdx / mdist) * repelPower;
            p.vy += (mdy / mdist) * repelPower;
            p.vx += (-mdy / mdist) * repelPower * 0.45;
            p.vy += (mdx / mdist) * repelPower * 0.45;
            p.vx += mouse.vx * 0.18;
            p.vy += mouse.vy * 0.18;
          }
        }

        p.vx *= 0.935;
        p.vy *= 0.935;
        p.x += p.vx;
        p.y += p.vy;

        const distFromCenter = Math.hypot(p.x - centerX, p.y - centerY);
        const wallLimit = maxRadius * 0.93;
        if (distFromCenter > wallLimit) {
          const normalAngle = Math.atan2(p.y - centerY, p.x - centerX);
          p.x = centerX + Math.cos(normalAngle) * wallLimit;
          p.y = centerY + Math.sin(normalAngle) * wallLimit;
          p.vx = -p.vx * 0.45 + -Math.sin(normalAngle) * 2;
          p.vy = -p.vy * 0.45 + Math.cos(normalAngle) * 2;
        }

        p.pulsePhase += p.pulseRate;
        const currentAlpha = Math.min(1, Math.max(0.2, p.alpha + Math.sin(p.pulsePhase) * 0.25));

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = currentAlpha;
        ctx.fill();
        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      if (gravityTimer) clearTimeout(gravityTimer);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("click", handleCanvasClick);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
    };
  }, [selectedId, currentArchangel, playHarmonicTone]);

  const handleOrbContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 390;
    const clickY = ((e.clientY - rect.top) / rect.height) * 390;
    clickWaveRef.current = { active: true, r: 5, x: clickX, y: clickY };
    playHarmonicTone(currentArchangel.frequencyHz);
  };

  const handleSelectArchangel = (archangel: Archangel) => {
    setSelectedId(archangel.id);
    clickWaveRef.current = { active: true, r: 5, x: 195, y: 195 };
    playHarmonicTone(archangel.frequencyHz);
  };

  const displayName = userName.trim() ? userName.trim() : "[Tu Nombre]";
  const fullDecree = `Yo, ${displayName}, ${currentArchangel.decreeText}\n${currentArchangel.closingText}`;

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(fullDecree);
      setCopiedStatus(true);
      setTimeout(() => setCopiedStatus(false), 2400);
    }
  };

  return (
    <section
      className={`relative w-full min-h-screen overflow-hidden py-10 px-3 sm:px-6 flex flex-col items-center justify-between text-neutral-100 ${className}`}
      style={{ backgroundColor: "#040508" }}
      aria-label="El Portal de los 7 Arcángeles · Sintonización Sagrada"
    >
      {/* Fondos Cósmicos Suaves */}
      <div
        className="pointer-events-none absolute -top-16 -right-16 w-80 h-80 sm:w-96 sm:h-96 rounded-full opacity-40 mix-blend-screen"
        style={{
          background: "radial-gradient(ellipse 65% 35% at 50% 50%, rgba(255,255,255,0.6) 0%, rgba(192,132,252,0.3) 28%, rgba(99,102,241,0.15) 55%, transparent 75%)",
          transform: "rotate(-28deg)",
          filter: "blur(8px)"
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-16 -left-16 w-80 h-80 sm:w-96 sm:h-96 rounded-full opacity-35 mix-blend-screen"
        style={{
          background: "radial-gradient(ellipse 70% 40% at 50% 50%, rgba(255,255,255,0.55) 0%, rgba(212,175,55,0.25) 28%, rgba(168,85,247,0.15) 55%, transparent 75%)",
          transform: "rotate(35deg)",
          filter: "blur(9px)"
        }}
      />

      {/* Resplandor ambiental reactivo con transición suave según el rayo */}
      <div
        className="pointer-events-none absolute inset-0 transition-all duration-1000 ease-out"
        style={{
          background: `radial-gradient(circle 580px at 50% 32%, ${currentArchangel.coreGlow.replace("0.85", "0.18")} 0%, transparent 72%)`
        }}
      />

      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
        {/* ============================================================ */}
        {/* ENCABEZADO DE LA EXPERIENCIA                                 */}
        {/* ============================================================ */}
        <header className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-300 text-xs font-semibold tracking-widest uppercase mb-3 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            <Sparkles size={13} className="animate-pulse" />
            <span>Portal Cuántico de Sintonización</span>
          </div>

          <h1
            className="text-2xl sm:text-3xl md:text-4xl font-sacred tracking-[0.24em] text-[#E8D8BA] uppercase font-bold drop-shadow-[0_2px_14px_rgba(232,216,186,0.3)]"
            style={{ textShadow: "0 0 25px rgba(212, 175, 55, 0.25)" }}
          >
            EL PORTAL DE LOS 7 ARCÁNGELES
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm font-sans text-slate-300 font-light tracking-wide max-w-xl mx-auto">
            Canaliza las frecuencias celestiales, activa tu escudo áurico y decreta la manifestación de tu más alta consciencia.
          </p>
        </header>

        {/* ============================================================ */}
        {/* BARRA DE HERRAMIENTAS ACÚSTICAS (Drone Solfeggio & Volumen) */}
        {/* ============================================================ */}
        <div className="w-full max-w-2xl mb-6 px-4 py-2.5 rounded-full border border-white/10 bg-[#0C0E18]/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDrone}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                isDroneActive
                  ? "border border-amber-400 bg-amber-400/25 text-amber-200 shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                  : "border border-white/15 bg-white/5 text-slate-300 hover:text-white hover:border-amber-400/30"
              }`}
            >
              {isDroneActive ? (
                <>
                  <Volume2 size={15} className="text-amber-300 animate-pulse" />
                  <span>Baño Sonoro {currentArchangel.frequencyHz} Hz Activo</span>
                </>
              ) : (
                <>
                  <VolumeX size={15} />
                  <span>Activar Baño Sonoro {currentArchangel.frequencyHz} Hz</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Volumen</span>
            <input
              type="range"
              min="0.02"
              max="0.4"
              step="0.01"
              value={droneVolume}
              onChange={(e) => setDroneVolume(parseFloat(e.target.value))}
              className="w-20 accent-amber-400 h-1 bg-white/20 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* ============================================================ */}
        {/* SELECTOR SUPERIOR: CÁPSULA DE LOS 7 ORBES DE CRISTAL         */}
        {/* ============================================================ */}
        <div className="relative w-full max-w-3xl mb-7 px-3 sm:px-6 py-3.5 sm:py-4 rounded-full border border-white/[0.1] bg-[#0c0e18]/65 backdrop-blur-md shadow-[0_20px_40px_rgba(0,0,0,0.7)] flex items-center justify-between sm:justify-around gap-1 sm:gap-2 overflow-x-auto sm:overflow-visible">
          {ARCHANGELS.map((archangel) => {
            const isSelected = archangel.id === currentArchangel.id;

            return (
              <button
                key={archangel.id}
                onClick={() => handleSelectArchangel(archangel)}
                className="group relative flex flex-col items-center shrink-0 focus:outline-none transition-transform duration-300 px-1 sm:px-1.5"
                aria-pressed={isSelected}
                aria-label={`Sintonizar con ${archangel.name}`}
              >
                {/* Halo radiante exterior en el orbe activo */}
                <div
                  className={`absolute -inset-2 rounded-full transition-all duration-700 pointer-events-none ${
                    isSelected ? "opacity-100 scale-110" : "opacity-0 group-hover:opacity-40 scale-95"
                  }`}
                  style={{
                    background: `radial-gradient(circle, ${archangel.colorHex} 0%, rgba(212,175,55,0.3) 35%, transparent 72%)`,
                    filter: "blur(6px)"
                  }}
                />

                {/* Orbe Esférico de Cristal 3D */}
                <div
                  className={`relative w-12 h-12 sm:w-13 sm:h-13 md:w-15 md:h-15 rounded-full flex items-center justify-center transition-all duration-500 overflow-hidden cursor-pointer ${
                    isSelected
                      ? "scale-110 ring-2 ring-[#EAD8B2] shadow-[0_0_25px_rgba(212,175,55,0.65)]"
                      : "opacity-75 hover:opacity-100 hover:scale-105"
                  }`}
                  style={{
                    background: `radial-gradient(circle at 35% 25%, #FFFFFF 0%, ${archangel.colorHex} 35%, #05060d 95%)`,
                    boxShadow: isSelected
                      ? `inset 0 -8px 16px rgba(0,0,0,0.85), inset 0 0 16px rgba(255,255,255,0.4), 0 0 20px ${archangel.colorHex}`
                      : `inset 0 -8px 14px rgba(0,0,0,0.8), 0 3px 10px rgba(0,0,0,0.6)`
                  }}
                >
                  {/* Reflejo especular superior brillante */}
                  <div className="pointer-events-none absolute top-1 inset-x-2.5 h-[34%] rounded-full bg-gradient-to-b from-white/75 to-transparent blur-[0.4px]" />

                  {/* Símbolo sagrado */}
                  <div className="relative z-10 text-white drop-shadow-[0_2px_5px_rgba(0,0,0,0.9)]">
                    <SacredGlyph symbol={archangel.symbol} className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                </div>

                {/* Nombre y frecuencia */}
                <span
                  className="mt-1.5 text-[11px] sm:text-xs font-serif tracking-wider transition-colors duration-300"
                  style={{
                    color: isSelected ? archangel.colorHex : "#94A3B8",
                    fontWeight: isSelected ? 600 : 400
                  }}
                >
                  {archangel.name}
                </span>
                <span className="text-[9px] font-mono text-stone-500">
                  {archangel.frequencyHz} Hz
                </span>
              </button>
            );
          })}
        </div>

        {/* ============================================================ */}
        {/* EL PORTAL CÓSMICO CENTRAL CON ONDAS EXPANSIVAS FÍSICAS       */}
        {/* ============================================================ */}
        <div className="relative mb-6 flex flex-col items-center">
          <motion.div
            onClick={handleOrbContainerClick}
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            className="group relative w-[290px] h-[290px] sm:w-[340px] sm:h-[340px] rounded-full p-2.5 bg-gradient-to-br from-amber-700 via-yellow-600 to-stone-900 shadow-2xl flex items-center justify-center cursor-pointer transition-all duration-700"
            style={{
              boxShadow: `0 0 55px 12px ${currentArchangel.coreGlow.replace("0.85", "0.28")}`
            }}
            title="Haz clic para dispersar las partículas con una onda de luz celestial"
          >
            {/* Anillo de Oro Viejo Biselado */}
            <div className="w-full h-full rounded-full p-2 bg-gradient-to-tr from-stone-950 via-[#18120b] to-[#2a1c0d] border-2 border-amber-500/60 shadow-[inset_0_0_25px_rgba(0,0,0,0.95)] flex items-center justify-center relative overflow-hidden">
              {/* Sombra de profundidad interior */}
              <div className="absolute inset-0 rounded-full shadow-[inset_0_0_35px_12px_rgba(0,0,0,0.95)] pointer-events-none z-20" />

              {/* Estrella Cósmica Superior Titilante */}
              <div className="pulsing-star absolute top-3 sm:top-4 z-20 pointer-events-none flex flex-col items-center">
                <div className="w-3.5 h-3.5 bg-white rounded-full blur-[0.8px] shadow-[0_0_22px_7px_#ffd978]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-[2px] bg-gradient-to-r from-transparent via-amber-100 to-transparent" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-14 w-[2px] bg-gradient-to-b from-transparent via-amber-100 to-transparent" />
              </div>

              {/* Reflejo de arco de cristal superior */}
              <div className="absolute -top-10 -left-10 w-3/4 h-3/4 rounded-full bg-gradient-to-br from-white/10 via-amber-200/5 to-transparent blur-md pointer-events-none z-20 transform rotate-12" />

              {/* Canvas Interactivo del Vórtice con Física de Ondas y Dispersión */}
              <canvas ref={canvasRef} className="w-full h-full rounded-full z-10 touch-none bg-black cursor-pointer" />

              {/* Símbolo Sagrado Flotante en el Centro del Vórtice */}
              <div
                className="absolute inset-0 z-15 pointer-events-none flex items-center justify-center transition-colors duration-700"
                style={{ color: currentArchangel.colorHex }}
              >
                <div className="p-3.5 sm:p-4 rounded-full bg-black/50 backdrop-blur-xs border border-white/20 shadow-[0_0_30px_rgba(0,0,0,0.85)]">
                  <SacredGlyph symbol={currentArchangel.symbol} className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-[0_0_15px_currentColor]" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Subtítulo Guía Interactivo */}
          <p className="mt-3 text-xs sm:text-sm text-amber-200/80 tracking-widest uppercase flex items-center justify-center gap-2">
            <span className="animate-pulse text-amber-400">✧</span>
            Haz clic para emitir la onda &bull; Pasa el cursor para apartar las partículas
            <span className="animate-pulse text-amber-400">✧</span>
          </p>
        </div>

        {/* ============================================================ */}
        {/* PESTAÑAS DE CONTENIDO: DECRETO | MEDITACIÓN | ATRIBUTOS      */}
        {/* ============================================================ */}
        <div className="w-full max-w-2xl px-2 relative mb-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            {[
              { id: "decreto", label: "Decreto de Sintonía", icon: Sparkles },
              { id: "meditacion", label: "Respiración Guiada", icon: Wind },
              { id: "atributos", label: "Atributos Sagrados", icon: Info }
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                    isActive
                      ? "border border-amber-400 bg-amber-400/20 text-amber-200 shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                      : "border border-white/10 bg-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  <TabIcon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            {/* PESTAÑA 1: DECRETO DE SINTONÍA */}
            {activeTab === "decreto" && (
              <motion.div
                key={`decreto-${currentArchangel.id}`}
                initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
                transition={{ duration: 0.45 }}
                className="relative rounded-2xl border border-[#D4AF37]/45 bg-[#0A0C16]/95 backdrop-blur-2xl px-6 sm:px-10 py-7 sm:py-8 shadow-[0_20px_60px_rgba(0,0,0,0.85)] overflow-hidden"
                style={{
                  boxShadow: `0 25px 65px -15px ${currentArchangel.coreGlow.replace("0.85", "0.2")}, inset 0 1px 1px rgba(212,175,55,0.25)`
                }}
              >
                {/* Símbolo en marca de agua decorativa */}
                <div className="pointer-events-none absolute top-5 right-6 opacity-25 text-[#D4AF37]">
                  <SacredGlyph symbol={currentArchangel.symbol} className="w-12 h-12" />
                </div>

                {/* Título de Canalización y Frecuencia */}
                <div className="text-center mb-4">
                  <span
                    className="inline-block text-[11px] font-sans tracking-widest uppercase px-3 py-0.5 rounded-full border mb-1.5 transition-colors duration-500 font-semibold"
                    style={{
                      color: currentArchangel.colorHex,
                      borderColor: `${currentArchangel.colorHex}50`,
                      backgroundColor: `${currentArchangel.colorHex}15`
                    }}
                  >
                    {currentArchangel.rayName} &bull; {currentArchangel.frequencyHz} Hz
                  </span>

                  <h3 className="text-base sm:text-lg md:text-xl font-sacred tracking-[0.22em] text-[#E8D8BA] uppercase font-bold drop-shadow-sm">
                    {currentArchangel.title}
                  </h3>
                </div>

                {/* Sintonía con Nombre Personalizado */}
                <div className="flex flex-wrap items-center justify-center gap-2 mb-5 text-xs">
                  <span className="text-slate-300 font-sans">Sintonizar con mi nombre:</span>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Escribe tu nombre aquí..."
                    className="px-3.5 py-1.5 rounded-full border border-[#D4AF37]/40 bg-black/60 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-[#D4AF37] font-serif text-xs transition-all w-48 sm:w-56 text-center"
                  />
                </div>

                {/* Cuerpo del Decreto */}
                <div className="text-center px-1 sm:px-4 mb-6">
                  <p className="text-xs sm:text-[14px] md:text-[15px] text-slate-200 font-sans leading-relaxed font-light">
                    Yo, <span className="text-[#E8D8BA] font-serif font-semibold underline underline-offset-4 decoration-[#D4AF37]/60">{displayName}</span>, {currentArchangel.decreeText}
                  </p>
                  <p className="mt-4 text-xs sm:text-sm font-sans text-amber-200/90 font-medium tracking-wide">
                    {currentArchangel.closingText}
                  </p>

                  {/* Botón de Acción Principal: Copiar Decreto */}
                  <div className="mt-5 flex justify-center">
                    <button
                      onClick={handleCopy}
                      className="group inline-flex items-center justify-center gap-2.5 py-2.5 sm:py-3 px-6 sm:px-8 rounded-full text-xs sm:text-[13px] font-sans tracking-[0.14em] uppercase transition-all duration-300 border border-[#D4AF37]/60 bg-gradient-to-b from-[#181926] to-[#0A0B13] hover:from-[#232538] hover:to-[#111220] text-[#E8D8BA] hover:text-[#FFF8EB] shadow-[0_4px_15px_rgba(0,0,0,0.6)] hover:shadow-[0_0_20px_rgba(212,175,55,0.35)] hover:scale-[1.02] cursor-pointer"
                    >
                      {copiedStatus ? (
                        <>
                          <Check size={16} className="text-emerald-400" />
                          <span className="font-semibold text-emerald-300">¡DECRETO COPIADO AL PORTAPAPELES!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={16} className="text-[#D4AF37]" />
                          <span className="font-semibold">COPIAR DECRETO DE SINTONIZACIÓN</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* PESTAÑA 2: RESPIRACIÓN GUIADA (Pacer 4-4-4-4) */}
            {activeTab === "meditacion" && (
              <motion.div
                key={`meditacion-${currentArchangel.id}`}
                initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
                transition={{ duration: 0.45 }}
                className="relative rounded-2xl border border-white/10 bg-[#0A0C16]/95 backdrop-blur-2xl px-6 sm:px-10 py-8 shadow-2xl flex flex-col items-center text-center overflow-hidden"
              >
                <span
                  className="text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full border mb-4"
                  style={{
                    color: currentArchangel.colorHex,
                    borderColor: `${currentArchangel.colorHex}50`,
                    backgroundColor: `${currentArchangel.colorHex}15`
                  }}
                >
                  Respiración de Luz Cuántica &bull; Ritmo 4x4
                </span>

                {/* Orbe Pacer con Animación de Escala */}
                <div className="relative w-36 h-36 my-6 flex items-center justify-center">
                  <motion.div
                    animate={{
                      scale:
                        breathPhase === "inhala"
                          ? [1, 1.45]
                          : breathPhase === "reten"
                          ? 1.45
                          : breathPhase === "exhala"
                          ? [1.45, 1]
                          : 1
                    }}
                    transition={{
                      duration: breathPhase === "reten" || breathPhase === "reposo" ? 0.3 : 4,
                      ease: "easeInOut"
                    }}
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `radial-gradient(circle, ${currentArchangel.colorHex} 0%, ${currentArchangel.colorHex}22 65%, transparent 75%)`,
                      boxShadow: `0 0 35px ${currentArchangel.colorHex}80`
                    }}
                  />
                  <div className="relative z-10 font-sacred text-2xl font-bold text-white drop-shadow-md">
                    {breathSeconds}s
                  </div>
                </div>

                <div className="space-y-2 max-w-md">
                  <h4 className="text-lg font-sacred uppercase tracking-wider text-amber-200">
                    {breathPhase === "inhala" && "1. Inhala la Luz Divina"}
                    {breathPhase === "reten" && "2. Retén y Siente la Frecuencia"}
                    {breathPhase === "exhala" && "3. Exhala y Libera"}
                    {breathPhase === "reposo" && "4. Reposa en Vacío Sagrado"}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                    {breathPhase === "inhala" && currentArchangel.inhaleGuidance}
                    {breathPhase === "reten" && `Siente cómo la frecuencia de ${currentArchangel.frequencyHz} Hz baña tus células en armonía.`}
                    {breathPhase === "exhala" && currentArchangel.exhaleGuidance}
                    {breathPhase === "reposo" && "Permanece en silencio interior, consciente de tu luz eterna."}
                  </p>
                </div>
              </motion.div>
            )}

            {/* PESTAÑA 3: ATRIBUTOS SAGRADOS Y CORRESPONDENCIAS */}
            {activeTab === "atributos" && (
              <motion.div
                key={`atributos-${currentArchangel.id}`}
                initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
                transition={{ duration: 0.45 }}
                className="relative rounded-2xl border border-white/10 bg-[#0A0C16]/95 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <h4 className="text-base sm:text-lg font-sacred text-amber-200 uppercase tracking-wider">
                    Correspondencias Cósmicas de {currentArchangel.name}
                  </h4>
                  <span className="font-mono text-xs text-amber-400 font-semibold">{currentArchangel.frequencyHz} Hz Solfeggio</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl border border-white/5 bg-white/[0.02] flex items-start gap-2.5">
                    <Shield className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-stone-400 font-medium">Virtud y Don Divino</span>
                      <span className="text-slate-200">{currentArchangel.virtue}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl border border-white/5 bg-white/[0.02] flex items-start gap-2.5">
                    <Activity className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-stone-400 font-medium">Chakra Resonante</span>
                      <span className="text-slate-200">{currentArchangel.chakraName}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl border border-white/5 bg-white/[0.02] flex items-start gap-2.5">
                    <Gem className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-stone-400 font-medium">Cristal / Mineral Sagrado</span>
                      <span className="text-slate-200">{currentArchangel.crystal}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl border border-white/5 bg-white/[0.02] flex items-start gap-2.5">
                    <Flame className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-stone-400 font-medium">Elemento & Dirección</span>
                      <span className="text-slate-200">{currentArchangel.element} &bull; {currentArchangel.direction}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl border border-white/5 bg-white/[0.02] sm:col-span-2 flex items-start gap-2.5">
                    <Sun className="w-4 h-4 text-yellow-300 shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-stone-400 font-medium">Momento Óptimo de Conexión</span>
                      <span className="text-slate-200">{currentArchangel.dayTime}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default ArchangelPortal;
