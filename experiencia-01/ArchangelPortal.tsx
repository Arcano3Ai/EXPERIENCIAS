"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  decreeText: string;
  closingText: string;
  whatsappMessage: string;
}

export const ARCHANGELS: Archangel[] = [
  {
    id: "miguel",
    name: "Miguel",
    title: "CANALIZACIÓN DE MIGUEL",
    rayName: "Rayo Azul Zafiro",
    frequencyHz: 741,
    chakraName: "Garganta & Protección",
    colorHex: "#3B82F6",
    coreGlow: "rgba(59, 130, 246, 0.8)",
    palette: ["#93C5FD", "#60A5FA", "#3B82F6", "#1D4ED8", "#FFFFFF"],
    symbol: "sword",
    decreeText: "invoco la presencia del Arcángel Miguel y su espada de luz zafiro. Corto todo lazo de miedo, juicio o atadura densa. Sello mi campo energético en la verdad divina y camino con valentía, soberanía y fe inquebrantable.",
    closingText: "Soy fuerza, soy valentía, soy protección.",
    whatsappMessage: "Hola Jess, sentí conectar con el Arcángel Miguel en tu web. Me gustaría info sobre el taller de blindaje áurico."
  },
  {
    id: "rafael",
    name: "Rafael",
    title: "CANALIZACIÓN DE RAFAEL",
    rayName: "Rayo Verde Esmeralda",
    frequencyHz: 528,
    chakraName: "Corazón & Sanación",
    colorHex: "#10B981",
    coreGlow: "rgba(16, 185, 129, 0.8)",
    palette: ["#A7F3D0", "#34D399", "#10B981", "#047857", "#FFFFFF"],
    symbol: "caduceus",
    decreeText: "abro cada célula, tejido y emoción al bálsamo esmeralda de Rafael. Libero las memorias de dolor físico o psíquico, restauro la armonía de mi cuerpo y permito que la salud perfecta del Cosmos fluya en mí.",
    closingText: "Soy salud, soy armonía, soy renovación.",
    whatsappMessage: "Hola Jess, me resonó la energía del Arcángel Rafael. Quisiera agendar una sesión de Reiki y sanación energética."
  },
  {
    id: "gabriel",
    name: "Gabriel",
    title: "CANALIZACIÓN DE GABRIEL",
    rayName: "Rayo Blanco Cristalino",
    frequencyHz: 852,
    chakraName: "Claridad & Expresión",
    colorHex: "#F1F5F9",
    coreGlow: "rgba(241, 245, 249, 0.85)",
    palette: ["#FFFFFF", "#E2E8F0", "#CBD5E1", "#94A3B8", "#FEF08A"],
    symbol: "trumpet",
    decreeText: "recibo la trompeta celestial y la luz diamantina de Gabriel. Despejo toda confusión de mi mente, abro mi corazón a los mensajes divinos y expreso mi verdad con autenticidad, gracia y propósito sagrado.",
    closingText: "Soy claridad, soy verdad, soy luz pura.",
    whatsappMessage: "Hola Jess, conecté con el Arcángel Gabriel en el portal. Me gustaría consultar una sesión de Tarot Terapéutico y claridad."
  },
  {
    id: "chamuel",
    name: "Chamuel",
    title: "CANALIZACIÓN DE CHAMUEL",
    rayName: "Rayo Rosa Cuarzo",
    frequencyHz: 639,
    chakraName: "Amor Incondicional",
    colorHex: "#F472B6",
    coreGlow: "rgba(244, 114, 182, 0.8)",
    palette: ["#FBCFE8", "#F472B6", "#EC4899", "#BE185D", "#FFFFFF"],
    symbol: "heart",
    decreeText: "envuelvo mi corazón en la llama rosa del Arcángel Chamuel. Sano toda herida de abandono o desamor, me abro a relaciones sagradas y elijo mirarme con ternura infinita y compasión divina.",
    closingText: "Soy amor, soy perdón, soy paz en mis vínculos.",
    whatsappMessage: "Hola Jess, conecté con el Arcángel Chamuel. Quisiera orientación para sanar mi corazón y armonizar mis vínculos afectivos."
  },
  {
    id: "uriel",
    name: "Uriel",
    title: "CANALIZACIÓN DE URIEL",
    rayName: "Rayo Rubí Dorado",
    frequencyHz: 417,
    chakraName: "Poder & Sabiduría",
    colorHex: "#FB923C",
    coreGlow: "rgba(251, 146, 60, 0.8)",
    palette: ["#FED7AA", "#FB923C", "#EA580C", "#9A3412", "#FDE047"],
    symbol: "flame",
    decreeText: "recibo la antorcha sagrada y la sabiduría divina del Arcángel Uriel. Disuelvo la ansiedad ante lo incierto, recibo respuestas claras para resolver mis desafíos y confío en la providencia del Universo.",
    closingText: "Soy sabiduría, soy serenidad, soy luz en el camino.",
    whatsappMessage: "Hola Jess, resoné con el Arcángel Uriel. Me gustaría una sesión para obtener claridad en un momento de cambio importante."
  },
  {
    id: "ariel",
    name: "Ariel",
    title: "CANALIZACIÓN DE ARIEL",
    rayName: "Rayo Ámbar & Abundancia",
    frequencyHz: 396,
    chakraName: "Enraizamiento & Prosperidad",
    colorHex: "#EAB308",
    coreGlow: "rgba(234, 179, 8, 0.85)",
    palette: ["#FEF08A", "#FACC15", "#EAB308", "#CA8A04", "#FFFFFF"],
    symbol: "lion",
    decreeText: "reconozco la generosidad de la Madre Tierra guiada por la presencia de Ariel. Abro mis brazos para recibir abundancia en sincronía perfecta y honro mi poder infinito de materializar prosperidad.",
    closingText: "Soy abundancia, soy gratitud, soy prosperidad.",
    whatsappMessage: "Hola Jess, sentí una fuerte conexión con el Arcángel Ariel. Quisiera info sobre el taller de manifestación y abundancia."
  },
  {
    id: "metatron",
    name: "Metatrón",
    title: "CANALIZACIÓN DE METATRÓN",
    rayName: "Rayo Violeta Cuántico",
    frequencyHz: 963,
    chakraName: "Corona & Ascensión",
    colorHex: "#A855F7",
    coreGlow: "rgba(168, 85, 247, 0.85)",
    palette: ["#F3E8FF", "#C084FC", "#A855F7", "#7E22CE", "#FDE047"],
    symbol: "metatron",
    decreeText: "reconozco mi divinidad interior y me conecto con la sabiduría cósmica de Metatrón. Abrazo mi luz, activo mi geometría sagrada y me alineo con la guía universal para manifestar mi más alta consciencia.",
    closingText: "Soy amor, soy luz, soy paz.",
    whatsappMessage: "Hola Jess, me conecté con la energía de Metatrón. Quisiera saber cómo agendar Registros Akáshicos o Sanación Cuántica."
  }
];

// Símbolos sagrados vectoriales nítidos
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
  phoneWhatsApp?: string; // 528110444618
  className?: string;
  initialId?: string;
}

export const ArchangelPortal: React.FC<ArchangelPortalProps> = ({
  phoneWhatsApp = "528110444618",
  className = "",
  initialId = "metatron"
}) => {
  const [selectedId, setSelectedId] = useState<string>(initialId);
  const [userName, setUserName] = useState<string>("");
  const [copiedStatus, setCopiedStatus] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const clickWaveRef = useRef<{ active: boolean; r: number; x: number; y: number } | null>(null);

  const currentArchangel =
    ARCHANGELS.find((a) => a.id === selectedId) || ARCHANGELS[6];

  // Campana de sonido celestial armónica
  const playHarmonicTone = (freq: number) => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      [freq, freq * 1.5, freq * 2].forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(f, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.06 / (idx + 1), now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 2.9);
      });
    } catch {
      // Ignora si audio no permitido
    }
  };

  // ============================================================
  // ============================================================
  // MOTOR FÍSICO DE PARTÍCULAS: REPULSIÓN DE MOUSE Y ONDA EXPANSIVA HACIA LOS LADOS
  // ============================================================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const size = 380;
    canvas.width = size;
    canvas.height = size;
    const centerX = size / 2;
    const centerY = size / 2;
    const maxRadius = size * 0.44;

    // Estado del cursor dentro del canvas
    const mouse = {
      x: -999,
      y: -999,
      prevX: -999,
      prevY: -999,
      vx: 0,
      vy: 0,
      active: false
    };

    // 160 partículas cósmicas de alta resolución
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

    const particles: CosmicParticle[] = Array.from({ length: 160 }, (_, idx) => {
      const angle = (idx / 160) * Math.PI * 2 + Math.random() * 0.3;
      const dist = 18 + Math.random() * (maxRadius * 0.78);
      return {
        x: centerX + Math.cos(angle) * dist,
        y: centerY + Math.sin(angle) * dist,
        vx: 0,
        vy: 0,
        orbitAngle: angle,
        orbitDist: dist,
        baseSpeed: (Math.random() * 0.007 + 0.003) * (idx % 2 === 0 ? 1 : -1),
        size: Math.random() < 0.25 ? Math.random() * 1.8 + 2.4 : Math.random() * 1.6 + 0.8,
        color: currentArchangel.palette[Math.floor(Math.random() * currentArchangel.palette.length)],
        alpha: Math.random() * 0.5 + 0.4,
        pulseRate: Math.random() * 0.04 + 0.02,
        pulsePhase: Math.random() * Math.PI * 2
      };
    });

    // Chispas efímeras eyectadas al hacer clic (burst sparks)
    interface Spark {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      size: number;
      alpha: number;
      decay: number;
    }
    const sparks: Spark[] = [];

    // Ondas expansivas de choque (Shockwaves)
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
    const shockwaves: Shockwave[] = [];

    // Factor de gravedad de retorno (se debilita tras un clic para que las partículas permanezcan en los lados)
    let returnGravity = 0.012;
    let gravityTimer: number | null = null;

    // Disparar Onda Expansiva Potente: lanza partículas directamente hacia los bordes
    const triggerShockwave = (clickX = centerX, clickY = centerY) => {
      // 1. Crear onda visual expansiva de choque
      shockwaves.push({
        x: clickX,
        y: clickY,
        radius: 4,
        maxRadius: maxRadius * 1.25,
        alpha: 1.0,
        speed: 7.2,
        color: currentArchangel.colorHex,
        thickness: 5.5
      });

      // Segunda onda secundaria armónica
      shockwaves.push({
        x: clickX,
        y: clickY,
        radius: 1,
        maxRadius: maxRadius * 1.1,
        alpha: 0.7,
        speed: 4.8,
        color: "#FFFFFF",
        thickness: 2.5
      });

      // 2. FÍSICA RADIAL EXPLOSIVA: Empujar TODAS las partículas con fuerza hacia los lados / bordes
      particles.forEach((p) => {
        let dx = p.x - clickX;
        let dy = p.y - clickY;
        let dist = Math.hypot(dx, dy);

        if (dist < 4) {
          // Si está en el mero centro del clic, dar dirección aleatoria
          const rndAng = Math.random() * Math.PI * 2;
          dx = Math.cos(rndAng);
          dy = Math.sin(rndAng);
          dist = 1;
        }

        // Fuerza explosiva: entre 18 y 34 px/frame según cercanía
        const blastPower = Math.max(14, 32 * (1 - dist / (maxRadius * 1.2)));
        p.vx += (dx / dist) * blastPower;
        p.vy += (dy / dist) * blastPower;
      });

      // 3. Crear 26 chispas eyectadas a gran velocidad hacia todas direcciones
      for (let s = 0; s < 26; s++) {
        const sparkAng = (s / 26) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
        const sparkSpeed = Math.random() * 8.5 + 4.5;
        sparks.push({
          x: clickX,
          y: clickY,
          vx: Math.cos(sparkAng) * sparkSpeed,
          vy: Math.sin(sparkAng) * sparkSpeed,
          color: Math.random() > 0.4 ? "#FFFFFF" : currentArchangel.palette[Math.floor(Math.random() * currentArchangel.palette.length)],
          size: Math.random() * 2.5 + 1.2,
          alpha: 1.0,
          decay: Math.random() * 0.025 + 0.018
        });
      }

      // Reducir la fuerza de retorno temporalmente para que se disfrute el viaje a los lados
      returnGravity = 0.0035;
      if (gravityTimer) clearTimeout(gravityTimer);
      gravityTimer = window.setTimeout(() => {
        returnGravity = 0.012;
      }, 1600);
    };

    // Actualizar coordenadas del mouse
    const updateMousePos = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const newX = ((clientX - rect.left) / rect.width) * size;
      const newY = ((clientY - rect.top) / rect.height) * size;

      if (mouse.prevX !== -999) {
        mouse.vx = newX - mouse.prevX;
        mouse.vy = newY - mouse.prevY;
      }
      mouse.prevX = newX;
      mouse.prevY = newY;
      mouse.x = newX;
      mouse.y = newY;
      mouse.active = true;
    };

    const handleMouseMove = (e: MouseEvent) => {
      updateMousePos(e.clientX, e.clientY);
    };

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
      const clickX = ((e.clientX - rect.left) / rect.width) * size;
      const clickY = ((e.clientY - rect.top) / rect.height) * size;
      triggerShockwave(clickX, clickY);
      playHarmonicTone(currentArchangel.frequencyHz);
    };

    // Soporte táctil
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updateMousePos(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const handleTouchEnd = () => {
      handleMouseLeave();
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("click", handleCanvasClick);
    canvas.addEventListener("touchmove", handleTouchMove, { passive: true });
    canvas.addEventListener("touchend", handleTouchEnd);

    // Revisar trigger externo (al pulsar orbe contenedor o seleccionar arcángel)
    const checkExternalWave = () => {
      if (clickWaveRef.current && clickWaveRef.current.active) {
        triggerShockwave(clickWaveRef.current.x, clickWaveRef.current.y);
        clickWaveRef.current.active = false;
      }
    };

    // BUCLE DE RENDERIZADO Y FÍSICA CONTINUA
    const render = () => {
      ctx.clearRect(0, 0, size, size);
      checkExternalWave();

      // 1. Fondo de obsidiana con profundidad estelar
      const bgGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius);
      bgGrad.addColorStop(0, `${currentArchangel.colorHex}22`);
      bgGrad.addColorStop(0.55, "#080b16");
      bgGrad.addColorStop(1, "#020306");
      ctx.fillStyle = bgGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, maxRadius, 0, Math.PI * 2);
      ctx.fill();

      // 2. Halo y vórtice de plasma celestial giratorio
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(Date.now() * 0.00032);
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.ellipse(0, 0, maxRadius * 0.72, maxRadius * 0.32, (i * Math.PI) / 3, 0, Math.PI * 2);
        ctx.strokeStyle = `${currentArchangel.colorHex}16`;
        ctx.lineWidth = 14;
        ctx.filter = "blur(8px)";
        ctx.stroke();
      }
      ctx.restore();
      ctx.filter = "none";

      // 3. ACTUALIZAR Y DIBUJAR ONDAS EXPANSIVAS (SHOCKWAVES)
      for (let w = shockwaves.length - 1; w >= 0; w--) {
        const sw = shockwaves[w];
        sw.radius += sw.speed;
        sw.alpha -= 0.022;

        if (sw.alpha <= 0 || sw.radius >= sw.maxRadius) {
          shockwaves.splice(w, 1);
          continue;
        }

        // Anillo visual de la onda con resplandor
        ctx.save();
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = sw.color;
        ctx.lineWidth = sw.thickness;
        ctx.globalAlpha = Math.max(0, sw.alpha);
        ctx.shadowColor = sw.color;
        ctx.shadowBlur = 18;
        ctx.stroke();

        // Anillo interior blanco brillante de alta frecuencia
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, Math.max(1, sw.radius - 1), 0, Math.PI * 2);
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = Math.max(0, sw.alpha * 0.85);
        ctx.stroke();
        ctx.restore();
      }

      // 4. ACTUALIZAR Y DIBUJAR CHISPAS EXPULSADAS (SPARKS)
      for (let s = sparks.length - 1; s >= 0; s--) {
        const sp = sparks[s];
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.vx *= 0.94;
        sp.vy *= 0.94;
        sp.alpha -= sp.decay;

        if (sp.alpha <= 0) {
          sparks.splice(s, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
        ctx.fillStyle = sp.color;
        ctx.globalAlpha = sp.alpha;
        ctx.shadowColor = sp.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.restore();
      }

      // 5. ACTUALIZAR Y DIBUJAR TODAS LAS PARTÍCULAS
      particles.forEach((p) => {
        // A. Movimiento orbital armónico
        p.orbitAngle += p.baseSpeed;
        const targetX = centerX + Math.cos(p.orbitAngle) * p.orbitDist;
        const targetY = centerY + Math.sin(p.orbitAngle) * p.orbitDist;

        // B. Retorno elástico suave hacia la órbita (aceleración gravitacional)
        p.vx += (targetX - p.x) * returnGravity;
        p.vy += (targetY - p.y) * returnGravity;

        // C. REPULSIÓN DEL MOUSE EN TIEMPO REAL:
        // Cuando pasas el mouse, las partículas se apartan activamente con fuerza y fluidez
        if (mouse.active) {
          const mdx = p.x - mouse.x;
          const mdy = p.y - mouse.y;
          const mdist = Math.hypot(mdx, mdy);
          const repelRadius = 115; // Radio amplio de detección

          if (mdist < repelRadius && mdist > 0.1) {
            // Fuerza de repulsión cuadrática (muy potente cerca, suave al límite)
            const ratio = 1 - mdist / repelRadius;
            const repelPower = ratio * ratio * 15;

            p.vx += (mdx / mdist) * repelPower;
            p.vy += (mdy / mdist) * repelPower;

            // Vórtice tangencial alrededor del cursor (efecto remolino cósmico)
            p.vx += (-mdy / mdist) * repelPower * 0.45;
            p.vy += (mdx / mdist) * repelPower * 0.45;

            // Arrastre por viento de movimiento del cursor
            p.vx += mouse.vx * 0.18;
            p.vy += mouse.vy * 0.18;
          }
        }

        // D. Fricción fluida (inercia orgánica)
        p.vx *= 0.935;
        p.vy *= 0.935;

        // E. Integración de posición
        p.x += p.vx;
        p.y += p.vy;

        // F. Rebote elástico contra los bordes del espejo (se mantienen en los lados sin salirse)
        const distFromCenter = Math.hypot(p.x - centerX, p.y - centerY);
        const wallLimit = maxRadius * 0.93;
        if (distFromCenter > wallLimit) {
          const normalAngle = Math.atan2(p.y - centerY, p.x - centerX);
          p.x = centerX + Math.cos(normalAngle) * wallLimit;
          p.y = centerY + Math.sin(normalAngle) * wallLimit;
          // Rebote y deslizamiento perimetral
          p.vx = -p.vx * 0.45 + -Math.sin(normalAngle) * 2;
          p.vy = -p.vy * 0.45 + Math.cos(normalAngle) * 2;
        }

        // G. Titilar / Pulso de brillo
        p.pulsePhase += p.pulseRate;
        const currentAlpha = Math.min(1, Math.max(0.2, p.alpha + Math.sin(p.pulsePhase) * 0.25));

        // H. Renderizar partícula estelar
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = currentAlpha;
        ctx.shadowColor = currentArchangel.colorHex;
        ctx.shadowBlur = p.size > 2 ? 9 : 4;
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
  }, [selectedId, currentArchangel]);

  // Manejar clic en el orbe central
  const handleOrbContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 380;
    const clickY = ((e.clientY - rect.top) / rect.height) * 380;
    clickWaveRef.current = { active: true, r: 5, x: clickX, y: clickY };
    playHarmonicTone(currentArchangel.frequencyHz);
  };

  // Al seleccionar un Arcángel: dispara onda expansiva desde el centro
  const handleSelectArchangel = (archangel: Archangel) => {
    setSelectedId(archangel.id);
    clickWaveRef.current = { active: true, r: 5, x: 180, y: 180 };
    playHarmonicTone(archangel.frequencyHz);
  };

  const displayName = userName.trim() ? userName.trim() : "[Tu Nombre]";
  const fullDecree = `Yo, ${displayName}, ${currentArchangel.decreeText}\n${currentArchangel.closingText}`;

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(fullDecree);
      setCopiedStatus(true);
      setTimeout(() => setCopiedStatus(false), 2200);
    }
  };

  const getWhatsAppUrl = () => {
    const text = `Hola Jess, estuve en el Portal de los 7 Arcángeles. Mi nombre es ${displayName} y conecté con el ${currentArchangel.name} (${currentArchangel.rayName}). Me gustaría consultar información sobre tus sesiones y talleres.`;
    return `https://wa.me/${phoneWhatsApp}?text=${encodeURIComponent(text)}`;
  };

  return (
    <section
      className={`relative w-full min-h-screen overflow-hidden py-12 px-3 sm:px-6 flex flex-col items-center justify-between text-neutral-100 ${className}`}
      style={{ backgroundColor: "#040508" }}
      aria-label="El Portal de los 7 Arcángeles - Nexos Estelares"
    >
      {/* Fondo Cósmico Suave */}
      <div
        className="pointer-events-none absolute -top-16 -right-16 w-80 h-80 sm:w-96 sm:h-96 rounded-full opacity-50 mix-blend-screen"
        style={{
          background: "radial-gradient(ellipse 65% 35% at 50% 50%, rgba(255,255,255,0.7) 0%, rgba(192,132,252,0.35) 28%, rgba(99,102,241,0.18) 55%, transparent 75%)",
          transform: "rotate(-28deg)",
          filter: "blur(6px)"
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-16 -left-16 w-80 h-80 sm:w-96 sm:h-96 rounded-full opacity-45 mix-blend-screen"
        style={{
          background: "radial-gradient(ellipse 70% 40% at 50% 50%, rgba(255,255,255,0.65) 0%, rgba(212,175,55,0.3) 28%, rgba(168,85,247,0.18) 55%, transparent 75%)",
          transform: "rotate(35deg)",
          filter: "blur(7px)"
        }}
      />

      {/* Resplandor ambiental reactivo con transición suave */}
      <div
        className="pointer-events-none absolute inset-0 transition-all duration-1000 ease-out"
        style={{
          background: `radial-gradient(circle 520px at 50% 36%, ${currentArchangel.coreGlow.replace("0.8", "0.14")} 0%, transparent 70%)`
        }}
      />

      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
        {/* ============================================================ */}
        {/* TÍTULO PRINCIPAL EN SERIF DORADA                             */}
        {/* ============================================================ */}
        <header className="text-center mb-7">
          <h1
            className="text-2xl sm:text-3xl md:text-[34px] font-serif tracking-[0.22em] text-[#E8D8BA] uppercase font-normal drop-shadow-[0_2px_14px_rgba(232,216,186,0.3)]"
            style={{
              textShadow: "0 0 20px rgba(212, 175, 55, 0.25)"
            }}
          >
            EL PORTAL DE LOS 7 ARCÁNGELES
          </h1>
          <p className="mt-1 text-xs sm:text-sm font-sans text-slate-400 font-light tracking-wide">
            Pasa el cursor sobre el espejo para dispersar las partículas o haz clic para liberar una onda de luz
          </p>
        </header>

        {/* ============================================================ */}
        {/* SELECTOR SUPERIOR: CÁPSULA DE LOS 7 ORBES DE CRISTAL         */}
        {/* ============================================================ */}
        <div className="relative w-full max-w-3xl mb-7 px-3 sm:px-6 py-3.5 sm:py-4 rounded-full border border-white/[0.1] bg-[#0c0e18]/45 backdrop-blur-md shadow-[0_20px_40px_rgba(0,0,0,0.7)] flex items-center justify-between sm:justify-around gap-1 sm:gap-2 overflow-x-auto sm:overflow-visible">
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

                  {/* Símbolo sagrado en blanco */}
                  <div className="relative z-10 text-white drop-shadow-[0_2px_5px_rgba(0,0,0,0.9)]">
                    <SacredGlyph symbol={archangel.symbol} className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                </div>

                {/* Nombre del Arcángel debajo */}
                <span
                  className="mt-1.5 text-[11px] sm:text-xs font-serif tracking-wider transition-colors duration-300"
                  style={{
                    color: isSelected ? archangel.colorHex : "#94A3B8",
                    fontWeight: isSelected ? 600 : 400
                  }}
                >
                  {archangel.name}
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
            className="group relative w-[280px] h-[280px] sm:w-[330px] sm:h-[330px] rounded-full p-2.5 bg-gradient-to-br from-amber-700 via-yellow-600 to-stone-900 shadow-2xl flex items-center justify-center cursor-pointer transition-all duration-700"
            style={{
              boxShadow: `0 0 50px 10px ${currentArchangel.coreGlow.replace("0.8", "0.25")}`
            }}
            title="Haz clic para dispersar las partículas con una onda de luz"
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
                <div className="p-3.5 sm:p-4 rounded-full bg-black/45 backdrop-blur-xs border border-white/15 shadow-[0_0_30px_rgba(0,0,0,0.85)]">
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
        {/* TARJETA INFERIOR CON TRANSICIÓN LÍQUIDA Y REVELACIÓN SUAVE  */}
        {/* ============================================================ */}
        <div className="w-full max-w-2xl px-2 relative mb-6">
          
          {/* Pestaña triangular conectora */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 border-t border-l border-[#D4AF37]/50 bg-[#0C0D17] z-20" />

          <AnimatePresence mode="wait">
            <motion.div
              key={currentArchangel.id}
              initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="relative rounded-2xl border border-[#D4AF37]/45 bg-[#0A0C16]/90 backdrop-blur-2xl px-6 sm:px-10 py-7 sm:py-8 shadow-[0_20px_60px_rgba(0,0,0,0.85)] overflow-hidden"
              style={{
                boxShadow: `0 25px 65px -15px ${currentArchangel.coreGlow.replace("0.8", "0.18")}, inset 0 1px 1px rgba(212,175,55,0.25)`
              }}
            >
              {/* Símbolo en marca de agua decorativa */}
              <div className="pointer-events-none absolute top-5 right-6 opacity-30 text-[#D4AF37]">
                <SacredGlyph symbol={currentArchangel.symbol} className="w-10 h-10" />
              </div>

              {/* Título de Canalización y Frecuencia */}
              <div className="text-center mb-4">
                <span
                  className="inline-block text-[11px] font-sans tracking-widest uppercase px-3 py-0.5 rounded-full border mb-1.5 transition-colors duration-500"
                  style={{
                    color: currentArchangel.colorHex,
                    borderColor: `${currentArchangel.colorHex}50`,
                    backgroundColor: `${currentArchangel.colorHex}15`
                  }}
                >
                  {currentArchangel.rayName} &bull; {currentArchangel.frequencyHz} Hz
                </span>

                <h3 className="text-base sm:text-lg md:text-xl font-serif tracking-[0.22em] text-[#E8D8BA] uppercase font-normal drop-shadow-sm">
                  {currentArchangel.title}
                </h3>
              </div>

              {/* Sintonía con Nombre Personalizado */}
              <div className="flex items-center justify-center gap-2 mb-4 text-xs">
                <span className="text-slate-400 font-sans">Sintonizar con mi nombre:</span>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Escribe tu nombre aquí..."
                  className="px-3 py-1 rounded-md border border-[#D4AF37]/40 bg-black/60 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-[#D4AF37] font-serif text-xs transition-all w-44 sm:w-52"
                />
              </div>

              {/* Cuerpo del Decreto */}
              <div className="text-center px-1 sm:px-4 mb-6">
                <p className="text-xs sm:text-[13.5px] md:text-sm text-slate-200 font-sans leading-relaxed font-light">
                  Yo, <span className="text-[#E8D8BA] font-serif font-medium underline underline-offset-4 decoration-[#D4AF37]/50">{displayName}</span>, {currentArchangel.decreeText}
                </p>
                <p className="mt-3.5 text-xs sm:text-sm font-sans text-slate-300 font-light tracking-wide">
                  {currentArchangel.closingText}
                </p>

                {/* Copiar decreto */}
                <div className="mt-3 flex justify-center">
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-[#E8D8BA] transition-colors"
                  >
                    <span>{copiedStatus ? "✓ Decreto Copiado" : "📋 Copiar Decreto Personalizado"}</span>
                  </button>
                </div>
              </div>

              {/* Botón: AGENDAR SESIÓN VÍA WHATSAPP */}
              <div className="flex justify-center">
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-2.5 py-2.5 sm:py-3 px-6 sm:px-8 rounded-full text-xs sm:text-[13px] font-sans tracking-[0.14em] uppercase transition-all duration-300 border border-[#D4AF37]/60 bg-gradient-to-b from-[#181926] to-[#0A0B13] hover:from-[#232538] hover:to-[#111220] text-[#E8D8BA] hover:text-[#FFF8EB] shadow-[0_4px_15px_rgba(0,0,0,0.6)] hover:shadow-[0_0_20px_rgba(212,175,55,0.35)] hover:scale-[1.02]"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4 text-[#D4AF37]"
                  >
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                  <span className="font-medium">AGENDAR SESIÓN VÍA WHATSAPP</span>
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default ArchangelPortal;
