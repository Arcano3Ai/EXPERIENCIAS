"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Smartphone,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
  Compass,
  Move,
  Info,
  Droplets,
  HelpCircle
} from "lucide-react";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  glow: string;
  isColliding: boolean;
}

interface ObstaclePin {
  x: number;
  y: number;
  radius: number;
  pulse: number;
}

export function SomaticRainstick({ onExit }: { onExit?: () => void }) {
  // Estados de Gatekeeper e interacción
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);
  const [deviceAngles, setDeviceAngles] = useState<{ beta: number; gamma: number; alpha: number }>({
    beta: 70, // Inclinación inicial natural hacia abajo
    gamma: 0,
    alpha: 0
  });
  const [isSimulated, setIsSimulated] = useState<boolean>(false);
  const [seedFlowIntensity, setSeedFlowIntensity] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showHelper, setShowHelper] = useState<boolean>(false);

  // Referencias de Audio y Canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const noiseSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const lastAngleRef = useRef<{ beta: number; gamma: number }>({ beta: 70, gamma: 0 });
  const mouseDragRef = useRef<{ isDragging: boolean; startY: number; startX: number }>({
    isDragging: false,
    startY: 0,
    startX: 0
  });

  // ============================================================
  // 1. GATEKEEPER & GESTIÓN DE PERMISOS (iOS 13+ & Android)
  // ============================================================
  const requestSensorPermissions = async () => {
    // Inicializar y desbloquear AudioContext en el gesto del usuario
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;
      if (ctx.state === "suspended") {
        await ctx.resume();
      }
      initRainstickAudio(ctx);
    } catch (err) {
      console.warn("AudioContext error:", err);
    }

    // Manejo de excepciones y permisos específicos de iOS
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof (DeviceOrientationEvent as any).requestPermission === "function"
    ) {
      try {
        const permissionState = await (DeviceOrientationEvent as any).requestPermission();
        if (permissionState === "granted") {
          setPermissionGranted(true);
          startRainstickExperience();
        } else {
          console.warn("Permiso de giroscopio denegado por el usuario. Activando modo simulado.");
          setIsSimulated(true);
          startRainstickExperience();
        }
      } catch (error) {
        console.error("Error al solicitar permisos del sensor:", error);
        setIsSimulated(true);
        startRainstickExperience();
      }
    } else {
      // Fallback para Android / Dispositivos / Desktop
      setPermissionGranted(true);
      startRainstickExperience();
    }
  };

  const startRainstickExperience = () => {
    setHasStarted(true);

    // Escuchar el evento de orientación nativa
    window.addEventListener("deviceorientation", handleOrientation, true);

    // Registrar telemetría con gtag
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "start_experience", { experience_name: "Palo de Lluvia" });
    }
  };

  const handleOrientation = (event: DeviceOrientationEvent) => {
    if (event.beta !== null && event.gamma !== null) {
      // Si el sensor emite datos reales, desactivamos modo simulado
      setIsSimulated(false);
      setDeviceAngles({
        beta: event.beta,
        gamma: event.gamma,
        alpha: event.alpha || 0
      });
    }
  };

  // ============================================================
  // 2. SÍNTESIS GRANULAR REACTIVA (Web Audio API)
  // ============================================================
  const initRainstickAudio = (ctx: AudioContext) => {
    try {
      // Generar buffer de ruido rosa y crujido de semillas
      const bufferSize = ctx.sampleRate * 2.5;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Filtro de ruido rosa (Paul Kellet)
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        let pink = b0 + b1 + b2 + white * 0.25;

        // Añadir pequeños granos de textura (semillas de cactus chocando)
        if (Math.random() < 0.04) {
          pink += (Math.random() * 2 - 1) * 1.8;
        }

        data[i] = pink * 0.14;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;
      noiseSource.loop = true;

      // Filtro de resonancia de madera / bambú (Bandpass con Q alto)
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(800, ctx.currentTime);
      filter.Q.setValueAtTime(3.5, ctx.currentTime);
      filterNodeRef.current = filter;

      // Control de Ganancia / Volumen
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gainNodeRef.current = gain;

      // Cadena de audio
      noiseSource.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noiseSource.start();
      noiseSourceRef.current = noiseSource;
    } catch (e) {
      console.warn("Fallo al iniciar audio del palo de lluvia:", e);
    }
  };

  // Disparar micro-impactos granulares individuales (semilla chocando con espina)
  const triggerGranularClick = useCallback((impactForce: number) => {
    if (!audioCtxRef.current || isMuted || !hasStarted) return;
    try {
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const clickGain = ctx.createGain();

      // Semillas de cuarzo/bambú: frecuencias percusivas acústicas entre 1400 y 3800 Hz
      osc.type = "sine";
      const pitch = 1400 + Math.random() * 2200;
      osc.frequency.setValueAtTime(pitch, ctx.currentTime);

      const vol = Math.min(Math.max(impactForce * 0.06, 0.008), 0.08);
      clickGain.gain.setValueAtTime(vol, ctx.currentTime);
      clickGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.025);

      osc.connect(clickGain);
      clickGain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    } catch (e) {}
  }, [isMuted, hasStarted]);

  // Actualizar síntesis de audio según la física de los ángulos
  useEffect(() => {
    if (!filterNodeRef.current || !gainNodeRef.current || !audioCtxRef.current || isMuted) return;

    const ctx = audioCtxRef.current;
    const { beta, gamma } = deviceAngles;

    // Calcular velocidad angular (cambio brusco de inclinación)
    const dAngle = Math.hypot(beta - lastAngleRef.current.beta, gamma - lastAngleRef.current.gamma);
    lastAngleRef.current = { beta, gamma };

    // Inclinación gravitacional neta (flujo constante hacia el extremo inferior del tubo)
    const radBeta = (beta * Math.PI) / 180;
    const radGamma = (gamma * Math.PI) / 180;
    const gravityComponent = Math.abs(Math.sin(radBeta)) + Math.abs(Math.sin(radGamma)) * 0.4;

    // Intensidad calculada: mezcla de inclinación sostenida + aceleración de movimiento
    const flowIntensity = Math.min(Math.max(gravityComponent * 0.7 + dAngle * 0.08, 0.02), 1.0);
    setSeedFlowIntensity(flowIntensity);

    // Modular Frecuencia de Resonancia del Bambú (500 Hz a 2800 Hz)
    const targetFreq = 500 + flowIntensity * 1900 + (Math.sin(radBeta) + 1) * 300;
    filterNodeRef.current.frequency.setTargetAtTime(targetFreq, ctx.currentTime, 0.08);

    // Modular Ganancia del Ruido de Fricción
    const targetGain = hasStarted ? flowIntensity * 0.28 : 0.001;
    gainNodeRef.current.gain.setTargetAtTime(targetGain, ctx.currentTime, 0.06);
  }, [deviceAngles, hasStarted, isMuted]);

  // Cleanup de listeners y audio
  useEffect(() => {
    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
      if (noiseSourceRef.current) {
        try {
          noiseSourceRef.current.stop();
          noiseSourceRef.current.disconnect();
        } catch (e) {}
      }
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close();
        } catch (e) {}
      }
    };
  }, []);

  // ============================================================
  // 3. FÍSICA VISUAL EN HTML5 CANVAS 2D (60 FPS)
  // ============================================================
  useEffect(() => {
    if (!hasStarted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    // Dimensionar canvas al tamaño del viewport
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const tubeWidth = Math.min(canvas.width * 0.65, 340);
    const tubeX = (canvas.width - tubeWidth) / 2;
    const tubeY = 40;
    const tubeHeight = canvas.height - 80;

    // Crear Espinas / Pines en espiral dentro del palo de lluvia
    const numPins = 42;
    const obstacles: ObstaclePin[] = [];
    for (let i = 0; i < numPins; i++) {
      const normY = (i + 1) / (numPins + 1);
      const angle = normY * Math.PI * 8; // Espiral sagrada
      const pinX = tubeX + tubeWidth / 2 + Math.sin(angle) * (tubeWidth * 0.38);
      const pinY = tubeY + normY * tubeHeight;
      obstacles.push({
        x: pinX,
        y: pinY,
        radius: 4,
        pulse: 0
      });
    }

    // Inicializar 140 Semillas Sagradas (Semillas de cuarzo y acacia dorada)
    const numParticles = 140;
    const particles: Particle[] = [];
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: tubeX + 20 + Math.random() * (tubeWidth - 40),
        y: tubeY + tubeHeight - 20 - Math.random() * 80,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        radius: 2.2 + Math.random() * 2.8,
        color: Math.random() > 0.4 ? "#F5D77F" : "#D4AF37",
        glow: "rgba(245, 215, 127, 0.6)",
        isColliding: false
      });
    }

    // Loop de Animación a 60 FPS
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Fondo Terroso Cálido
      const bgGrad = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        tubeWidth * 0.2,
        canvas.width / 2,
        canvas.height / 2,
        canvas.height * 0.7
      );
      bgGrad.addColorStop(0, "#24130A");
      bgGrad.addColorStop(0.6, "#150A04");
      bgGrad.addColorStop(1, "#0A0402");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Calcular Vector de Gravedad a partir de los ángulos Beta y Gamma
      const radBeta = (deviceAngles.beta * Math.PI) / 180;
      const radGamma = (deviceAngles.gamma * Math.PI) / 180;

      // Gravedad dinámica en X e Y
      const gx = Math.sin(radGamma) * 0.85;
      const gy = Math.sin(radBeta) * 0.95;

      // ==========================================
      // DIBUJAR SILUETA DEL PALO DE LLUVIA (BAMBÚ)
      // ==========================================
      ctx.save();
      // Sombra exterior del tubo
      ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
      ctx.shadowBlur = 30;

      // Cuerpo del tubo
      const woodGrad = ctx.createLinearGradient(tubeX, 0, tubeX + tubeWidth, 0);
      woodGrad.addColorStop(0, "#5E3A1A");
      woodGrad.addColorStop(0.15, "#8B5A2B");
      woodGrad.addColorStop(0.5, "#A06B33");
      woodGrad.addColorStop(0.85, "#8B5A2B");
      woodGrad.addColorStop(1, "#4A2B11");

      ctx.fillStyle = woodGrad;
      ctx.beginPath();
      ctx.roundRect(tubeX, tubeY, tubeWidth, tubeHeight, 28);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Interior Hueco Resonante
      const cavityGrad = ctx.createLinearGradient(tubeX, 0, tubeX + tubeWidth, 0);
      cavityGrad.addColorStop(0, "rgba(20, 10, 4, 0.92)");
      cavityGrad.addColorStop(0.5, "rgba(42, 22, 10, 0.75)");
      cavityGrad.addColorStop(1, "rgba(20, 10, 4, 0.92)");

      ctx.fillStyle = cavityGrad;
      ctx.beginPath();
      ctx.roundRect(tubeX + 10, tubeY + 10, tubeWidth - 20, tubeHeight - 20, 20);
      ctx.fill();

      // Ribetes Dorados & Anillos Tribales del Bambú
      ctx.strokeStyle = "rgba(212, 175, 55, 0.4)";
      ctx.lineWidth = 2;
      const numRings = 9;
      for (let r = 1; r < numRings; r++) {
        const ringY = tubeY + (tubeHeight / numRings) * r;
        ctx.beginPath();
        ctx.moveTo(tubeX + 6, ringY);
        ctx.lineTo(tubeX + tubeWidth - 6, ringY);
        ctx.stroke();

        // Puntos sagrados en los anillos
        ctx.fillStyle = "#F5D77F";
        ctx.beginPath();
        ctx.arc(tubeX + tubeWidth / 2, ringY, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Dibujar Espinas / Pines Internos con brillo
      obstacles.forEach((pin) => {
        if (pin.pulse > 0) pin.pulse -= 0.05;

        // Espina de madera que cruza
        ctx.strokeStyle = "rgba(194, 155, 56, 0.65)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(pin.x - 14, pin.y);
        ctx.lineTo(pin.x + 14, pin.y);
        ctx.stroke();

        // Pin central
        ctx.fillStyle = pin.pulse > 0 ? "#FFF4CC" : "#C29B38";
        ctx.beginPath();
        ctx.arc(pin.x, pin.y, pin.radius + Math.max(pin.pulse * 2, 0), 0, Math.PI * 2);
        ctx.fill();
      });

      // ==========================================
      // FÍSICA Y RENDER DE SEMILLAS DE CUARZO
      // ==========================================
      particles.forEach((p) => {
        // Aplicar gravedad
        p.vx += gx * 0.45;
        p.vy += gy * 0.45;

        // Fricción del aire dentro del tubo
        p.vx *= 0.96;
        p.vy *= 0.96;

        p.x += p.vx;
        p.y += p.vy;

        // Colisión con paredes laterales del tubo
        const minX = tubeX + 14 + p.radius;
        const maxX = tubeX + tubeWidth - 14 - p.radius;
        if (p.x < minX) {
          p.x = minX;
          p.vx = -p.vx * 0.45;
        } else if (p.x > maxX) {
          p.x = maxX;
          p.vx = -p.vx * 0.45;
        }

        // Colisión con fondo superior e inferior del tubo
        const minY = tubeY + 14 + p.radius;
        const maxY = tubeY + tubeHeight - 14 - p.radius;
        if (p.y < minY) {
          p.y = minY;
          p.vy = -p.vy * 0.4;
          if (Math.abs(p.vy) > 0.8) triggerGranularClick(Math.abs(p.vy));
        } else if (p.y > maxY) {
          p.y = maxY;
          p.vy = -p.vy * 0.4;
          if (Math.abs(p.vy) > 0.8) triggerGranularClick(Math.abs(p.vy));
        }

        // Colisión con las espinas / obstáculos internos
        obstacles.forEach((obs) => {
          const dx = p.x - obs.x;
          const dy = p.y - obs.y;
          const dist = Math.hypot(dx, dy);
          const minDist = p.radius + obs.radius;

          if (dist < minDist) {
            // Rebote elástico
            const nx = dx / (dist || 1);
            const ny = dy / (dist || 1);
            p.x = obs.x + nx * minDist;
            p.y = obs.y + ny * minDist;

            const dot = p.vx * nx + p.vy * ny;
            p.vx = (p.vx - 1.6 * dot * nx) * 0.75 + (Math.random() - 0.5) * 0.5;
            p.vy = (p.vy - 1.6 * dot * ny) * 0.75 + (Math.random() - 0.5) * 0.5;

            obs.pulse = 1.0;
            const impactForce = Math.hypot(p.vx, p.vy);
            if (impactForce > 0.6) {
              triggerGranularClick(impactForce);
            }
          }
        });

        // Dibujar Semilla con Halo Áureo
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Pequeño brillo estelar si se mueve a alta velocidad
        const speed = Math.hypot(p.vx, p.vy);
        if (speed > 2.0) {
          ctx.strokeStyle = "rgba(245, 215, 127, 0.45)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * 1.5, p.y - p.vy * 1.5);
          ctx.stroke();
        }
      });

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [hasStarted, deviceAngles, triggerGranularClick]);

  // Soporte para interactuar con Mouse / Touch en Desktop (Simulador de Giroscopio)
  const handlePointerDown = (e: React.PointerEvent) => {
    mouseDragRef.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!mouseDragRef.current.isDragging) return;
    const dx = e.clientX - mouseDragRef.current.startX;
    const dy = e.clientY - mouseDragRef.current.startY;

    // Convertir desplazamiento en ángulos Beta (-180 a 180) y Gamma (-90 a 90)
    setDeviceAngles((prev) => {
      const newBeta = Math.max(-180, Math.min(180, prev.beta + dy * 0.35));
      const newGamma = Math.max(-90, Math.min(90, prev.gamma + dx * 0.35));
      return { beta: newBeta, gamma: newGamma, alpha: 0 };
    });

    mouseDragRef.current.startX = e.clientX;
    mouseDragRef.current.startY = e.clientY;
  };

  const handlePointerUp = () => {
    mouseDragRef.current.isDragging = false;
  };

  return (
    <div
      className="relative w-full h-screen bg-[#120904] overflow-hidden select-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* ============================================================ */}
      {/* PANTALLA INICIAL (GATEKEEPER)                                */}
      {/* ============================================================ */}
      <AnimatePresence>
        {!hasStarted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.45 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-[#1C1008]/95 via-[#120904]/98 to-[#0A0402] backdrop-blur-2xl"
          >
            {/* Ícono de Experiencia Ancestral */}
            <div className="w-20 h-20 mb-6 rounded-3xl border border-amber-400/35 bg-gradient-to-tr from-amber-600/20 via-yellow-500/10 to-transparent flex items-center justify-center shadow-[0_0_40px_rgba(212,175,55,0.25)]">
              <Droplets className="w-9 h-9 text-amber-300 animate-pulse" />
            </div>

            <span className="text-xs uppercase tracking-[0.35em] text-amber-400 font-semibold font-sans mb-2">
              Instrumento Chamánico Interactivo
            </span>

            <h1 className="text-3xl sm:text-5xl font-sacred font-bold text-white tracking-wide max-w-lg mb-4">
              Palo de Lluvia Somático
            </h1>

            <p className="max-w-md text-sm sm:text-base text-stone-300 font-sans leading-relaxed mb-8">
              Tu dispositivo se convierte en un instrumento de sanación acústica viva.
              Inclina físicamente tu teléfono para hacer fluir las semillas de cuarzo a través del bambú.
            </p>

            {/* Botón Gatekeeper Conectar */}
            <button
              onClick={requestSensorPermissions}
              className="px-8 py-4 rounded-full border-2 border-[#D4AF37] bg-gradient-to-r from-[#A06B33] via-[#8C4024] to-[#5E3A1A] text-white font-sacred font-bold tracking-widest text-sm sm:text-base uppercase shadow-[0_0_35px_rgba(212,175,55,0.45)] hover:shadow-[0_0_50px_rgba(245,215,127,0.7)] hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
            >
              <Smartphone size={20} className="text-amber-200" />
              <span>Sostener Dispositivo y Conectar</span>
            </button>

            <div className="mt-8 flex items-center gap-4 text-xs text-amber-300/70 font-sans">
              <span className="flex items-center gap-1.5">
                <Compass size={14} /> Giroscopio Nativo 60 FPS
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Volume2 size={14} /> Síntesis Granular Web Audio
              </span>
            </div>

            <p className="mt-4 text-[11px] text-stone-400 max-w-xs">
              En computadoras de escritorio, puedes arrastrar la pantalla con el cursor para simular el giro físico.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/* CANVAS DEL INSTRUMENTO                                       */}
      {/* ============================================================ */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* ============================================================ */}
      {/* INTERFAZ MINIMALISTA EN PANTALLA COMPLETA                    */}
      {/* ============================================================ */}
      {hasStarted && (
        <>
          {/* Barra Superior Discreta */}
          <div className="absolute top-4 left-4 right-4 z-40 flex items-center justify-between pointer-events-none">
            {/* Indicador de Ángulo y Frecuencia */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-[#120904]/70 backdrop-blur-md text-xs text-stone-300 pointer-events-auto">
              <Compass size={14} className="text-amber-400" />
              <span className="font-mono">
                {Math.round(deviceAngles.beta)}° / {Math.round(deviceAngles.gamma)}°
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse ml-1" />
            </div>

            {/* Controles: Mutear, Ayuda y Salir */}
            <div className="flex items-center gap-2 pointer-events-auto">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="w-10 h-10 rounded-full border border-white/10 bg-[#120904]/70 backdrop-blur-md flex items-center justify-center text-stone-300 hover:text-white transition-all"
                title={isMuted ? "Activar Audio" : "Silenciar"}
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} className="text-amber-300" />}
              </button>

              <button
                onClick={() => setShowHelper(!showHelper)}
                className="w-10 h-10 rounded-full border border-white/10 bg-[#120904]/70 backdrop-blur-md flex items-center justify-center text-stone-300 hover:text-white transition-all"
                title="Información"
              >
                <HelpCircle size={18} />
              </button>

              {onExit && (
                <button
                  onClick={onExit}
                  className="w-10 h-10 rounded-full border border-white/10 bg-[#120904]/70 backdrop-blur-md flex items-center justify-center text-stone-300 hover:text-white transition-all"
                  title="Volver"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>

          {/* Medidor de Flujo Somático Inferior */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-40 pointer-events-none text-center">
            <motion.div
              animate={{ opacity: seedFlowIntensity > 0.1 ? 0.9 : 0.4 }}
              className="px-5 py-2 rounded-full border border-amber-400/20 bg-[#120904]/80 backdrop-blur-lg text-xs text-amber-200/90 font-sans tracking-wider"
            >
              {seedFlowIntensity > 0.6
                ? "Torrente de Cuarzo en Cascada"
                : seedFlowIntensity > 0.2
                ? "Llovizna Mística de Semillas"
                : "Reposo en Gravedad Serena"}
            </motion.div>
          </div>

          {/* Modal / Card de Ayuda Somática */}
          <AnimatePresence>
            {showHelper && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="absolute inset-x-4 top-20 max-w-sm mx-auto z-50 p-5 rounded-2xl border border-amber-400/30 bg-[#1C1008]/95 backdrop-blur-xl shadow-2xl space-y-3 text-xs text-stone-300"
              >
                <div className="flex items-center justify-between text-amber-300 font-sacred font-bold text-sm">
                  <span>Guía Somática de Uso</span>
                  <button onClick={() => setShowHelper(false)}>
                    <X size={16} />
                  </button>
                </div>
                <p>
                  <strong>En tu Celular:</strong> Toma el dispositivo con ambas manos y gíralo despacio hacia arriba y hacia abajo para sentir el roce de las semillas.
                </p>
                <p>
                  <strong>En Computadora:</strong> Haz clic y arrastra hacia arriba o abajo en la pantalla para inclinar virtualmente el tubo.
                </p>
                <p className="text-[11px] text-amber-300/80 italic pt-1 border-t border-white/10">
                  Cierra los ojos y sincroniza tu respiración con el sonido de la lluvia de cuarzo.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}

export default SomaticRainstick;
