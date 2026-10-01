"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Smartphone,
  Volume2,
  VolumeX,
  X,
  Compass,
  Droplets,
  HelpCircle,
  Activity
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
}

interface ObstaclePin {
  x: number;
  y: number;
  radius: number;
  pulse: number;
}

export function SomaticRainstick({ onExit }: { onExit?: () => void }) {
  // Estados de UI y control
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showHelper, setShowHelper] = useState<boolean>(false);
  const [sensorDebug, setSensorDebug] = useState<string>("Esperando inicio...");
  const [activityState, setActivityState] = useState<string>("En reposo");

  // Referencias para evitar re-renderizados que reinicien el Canvas o el Audio
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const noiseSourceRef = useRef<AudioBufferSourceNode | null>(null);

  // Vector de Gravedad e Inclinación en useRef (Lectura directa a 60 FPS sin resets de React)
  const orientationRef = useRef<{
    beta: number;   // Inclinación frontal (-180 a 180)
    gamma: number;  // Inclinación lateral (-90 a 90)
    gx: number;     // Gravedad calculada en X
    gy: number;     // Gravedad calculada en Y
    hasMotion: boolean;
  }>({
    beta: 75,
    gamma: 0,
    gx: 0,
    gy: 0.85,
    hasMotion: false
  });

  // ============================================================
  // 1. GATEKEEPER & INICIALIZACIÓN DE SENSORES NATIVOS
  // ============================================================
  const requestSensorPermissions = async () => {
    // 1.1 Iniciar y reactivar AudioContext en el gesto del usuario
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

    // 1.2 Solicitar permisos de giroscopio en iOS 13+
    let granted = false;
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof (DeviceOrientationEvent as any).requestPermission === "function"
    ) {
      try {
        const orientationPerm = await (DeviceOrientationEvent as any).requestPermission();
        if (orientationPerm === "granted") granted = true;
      } catch (e) {
        console.warn("DeviceOrientation error en iOS:", e);
      }
    } else {
      granted = true; // Android / Browsers modernos no requieren permiso explícito síncrono
    }

    if (
      typeof DeviceMotionEvent !== "undefined" &&
      typeof (DeviceMotionEvent as any).requestPermission === "function"
    ) {
      try {
        await (DeviceMotionEvent as any).requestPermission();
      } catch (e) {}
    }

    // 1.3 Iniciar listeners de sensores físicos
    startSensorListeners();
    setHasStarted(true);

    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "start_experience", { experience_name: "Palo de Lluvia" });
    }
  };

  const startSensorListeners = () => {
    // Escuchar Orientación del Dispositivo (Ángulos Beta y Gamma)
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta !== null && e.gamma !== null) {
        orientationRef.current.beta = e.beta;
        orientationRef.current.gamma = e.gamma;
        orientationRef.current.hasMotion = true;

        // Conversión a vector de gravedad normalizado
        const radBeta = (e.beta * Math.PI) / 180;
        const radGamma = (e.gamma * Math.PI) / 180;

        // Eje X: inclinación lateral
        orientationRef.current.gx = Math.sin(radGamma) * 1.1;
        // Eje Y: si el teléfono está vertical (beta=90) gravedad es hacia abajo; si está invertido (beta=-90) hacia arriba
        orientationRef.current.gy = Math.sin(radBeta) * 1.1;

        setSensorDebug(`β: ${Math.round(e.beta)}° | γ: ${Math.round(e.gamma)}°`);
      }
    };

    // Escuchar Movimiento/Acelerómetro directo (Respaldo físico ultra-preciso)
    const handleMotion = (e: DeviceMotionEvent) => {
      const acc = e.accelerationIncludingGravity;
      if (acc && acc.x !== null && acc.y !== null) {
        orientationRef.current.hasMotion = true;
        // Normalización de m/s^2 a vector unitario (-9.8 a 9.8)
        // En Android vs iOS el signo de Y puede variar, adaptamos a coordenadas de pantalla
        const gx = -(acc.x || 0) / 9.8;
        const gy = (acc.y || 0) / 9.8;
        orientationRef.current.gx = Math.max(-1.5, Math.min(1.5, gx));
        orientationRef.current.gy = Math.max(-1.5, Math.min(1.5, gy));
      }
    };

    window.addEventListener("deviceorientation", handleOrientation, true);
    window.addEventListener("devicemotion", handleMotion, true);
  };

  // ============================================================
  // 2. MOTOR DE AUDIO GRANULAR REACTIVO (Web Audio API)
  // ============================================================
  const initRainstickAudio = (ctx: AudioContext) => {
    try {
      const bufferSize = ctx.sampleRate * 2.0;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Generar ruido de textura de semillas de cactus/cuarzo
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555;
        b1 = 0.99332 * b1 + white * 0.075;
        b2 = 0.96900 * b2 + white * 0.153;
        let pink = b0 + b1 + b2 + white * 0.3;
        // Micro-granos percusivos
        if (Math.random() < 0.035) {
          pink += (Math.random() * 2 - 1) * 2.0;
        }
        data[i] = pink * 0.16;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;
      noiseSource.loop = true;

      // Filtro pasa banda emulando resonancia del tubo de bambú
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(850, ctx.currentTime);
      filter.Q.setValueAtTime(3.2, ctx.currentTime);
      filterNodeRef.current = filter;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gainNodeRef.current = gain;

      noiseSource.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noiseSource.start();
      noiseSourceRef.current = noiseSource;
    } catch (e) {
      console.warn("Audio init error:", e);
    }
  };

  // Reproducir click percusivo sutil cuando una semilla colisiona contra espinas
  const playImpactSound = useCallback((force: number) => {
    if (!audioCtxRef.current || isMuted || !hasStarted) return;
    try {
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const clickGain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(1200 + Math.random() * 1800, ctx.currentTime);

      const vol = Math.min(Math.max(force * 0.03, 0.005), 0.05);
      clickGain.gain.setValueAtTime(vol, ctx.currentTime);
      clickGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.02);

      osc.connect(clickGain);
      clickGain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.025);
    } catch (e) {}
  }, [isMuted, hasStarted]);

  // ============================================================
  // 3. FÍSICA VISUAL CONTINUA EN CANVAS 2D A 60 FPS
  // ============================================================
  useEffect(() => {
    if (!hasStarted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Dimensiones del tubo de bambú
    const tubeWidth = Math.min(canvas.width * 0.72, 330);
    const tubeHeight = canvas.height - 70;
    const tubeX = (canvas.width - tubeWidth) / 2;
    const tubeY = 35;

    // Crear 48 espinas internas en espiral sagrada
    const numPins = 48;
    const pins: ObstaclePin[] = [];
    for (let i = 0; i < numPins; i++) {
      const normY = (i + 1) / (numPins + 1);
      const angle = normY * Math.PI * 10;
      pins.push({
        x: tubeX + tubeWidth / 2 + Math.sin(angle) * (tubeWidth * 0.36),
        y: tubeY + normY * tubeHeight,
        radius: 3.5,
        pulse: 0
      });
    }

    // Crear 150 semillas de cuarzo y acacia dorada
    const numParticles = 150;
    const particles: Particle[] = [];
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: tubeX + 25 + Math.random() * (tubeWidth - 50),
        y: tubeY + tubeHeight * 0.35 + Math.random() * (tubeHeight * 0.3), // Distribución inicial en el centro
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        radius: 2.2 + Math.random() * 2.5,
        color: Math.random() > 0.4 ? "#F5D77F" : "#D4AF37",
        glow: "rgba(245, 215, 127, 0.6)"
      });
    }

    // Bucle Principal de Render y Física (Persistente, sin resets)
    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Fondo ambiente terroso
      const bgGrad = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        tubeWidth * 0.15,
        canvas.width / 2,
        canvas.height / 2,
        canvas.height * 0.75
      );
      bgGrad.addColorStop(0, "#221107");
      bgGrad.addColorStop(0.65, "#130903");
      bgGrad.addColorStop(1, "#080301");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Leer Vector de Gravedad del Giroscopio (Directo desde la referencia)
      const gx = orientationRef.current.gx;
      const gy = orientationRef.current.gy;

      // ------------------------------------------
      // DIBUJAR TUBO DE BAMBÚ SAGRADO
      // ------------------------------------------
      ctx.save();
      ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
      ctx.shadowBlur = 35;

      const woodGrad = ctx.createLinearGradient(tubeX, 0, tubeX + tubeWidth, 0);
      woodGrad.addColorStop(0, "#553215");
      woodGrad.addColorStop(0.2, "#855325");
      woodGrad.addColorStop(0.5, "#A06B33");
      woodGrad.addColorStop(0.8, "#855325");
      woodGrad.addColorStop(1, "#40220B");

      ctx.fillStyle = woodGrad;
      ctx.beginPath();
      ctx.roundRect(tubeX, tubeY, tubeWidth, tubeHeight, 26);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Cavidad interior resonante
      const cavityGrad = ctx.createLinearGradient(tubeX, 0, tubeX + tubeWidth, 0);
      cavityGrad.addColorStop(0, "rgba(18, 8, 3, 0.94)");
      cavityGrad.addColorStop(0.5, "rgba(38, 18, 7, 0.78)");
      cavityGrad.addColorStop(1, "rgba(18, 8, 3, 0.94)");

      ctx.fillStyle = cavityGrad;
      ctx.beginPath();
      ctx.roundRect(tubeX + 8, tubeY + 8, tubeWidth - 16, tubeHeight - 16, 20);
      ctx.fill();

      // Anillos y grabados tribales del bambú
      ctx.strokeStyle = "rgba(212, 175, 55, 0.45)";
      ctx.lineWidth = 1.8;
      const rings = 10;
      for (let r = 1; r < rings; r++) {
        const ry = tubeY + (tubeHeight / rings) * r;
        ctx.beginPath();
        ctx.moveTo(tubeX + 5, ry);
        ctx.lineTo(tubeX + tubeWidth - 5, ry);
        ctx.stroke();

        ctx.fillStyle = "#F5D77F";
        ctx.beginPath();
        ctx.arc(tubeX + tubeWidth / 2, ry, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Espinas internas
      pins.forEach((pin) => {
        if (pin.pulse > 0) pin.pulse -= 0.04;

        ctx.strokeStyle = "rgba(212, 175, 55, 0.6)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(pin.x - 12, pin.y);
        ctx.lineTo(pin.x + 12, pin.y);
        ctx.stroke();

        ctx.fillStyle = pin.pulse > 0 ? "#FFF5D0" : "#C29B38";
        ctx.beginPath();
        ctx.arc(pin.x, pin.y, pin.radius + Math.max(pin.pulse * 2.2, 0), 0, Math.PI * 2);
        ctx.fill();
      });

      // ------------------------------------------
      // FÍSICA DE SEMILLAS
      // ------------------------------------------
      let totalSpeed = 0;

      particles.forEach((p) => {
        // Aplicar gravedad física del sensor
        p.vx += gx * 0.42;
        p.vy += gy * 0.42;

        // Fricción
        p.vx *= 0.965;
        p.vy *= 0.965;

        p.x += p.vx;
        p.y += p.vy;

        const minX = tubeX + 12 + p.radius;
        const maxX = tubeX + tubeWidth - 12 - p.radius;
        const minY = tubeY + 12 + p.radius;
        const maxY = tubeY + tubeHeight - 12 - p.radius;

        // Rebotes en paredes
        if (p.x < minX) {
          p.x = minX;
          p.vx = -p.vx * 0.42;
        } else if (p.x > maxX) {
          p.x = maxX;
          p.vx = -p.vx * 0.42;
        }

        if (p.y < minY) {
          p.y = minY;
          p.vy = -p.vy * 0.38;
          if (Math.abs(p.vy) > 0.8) playImpactSound(Math.abs(p.vy));
        } else if (p.y > maxY) {
          p.y = maxY;
          p.vy = -p.vy * 0.38;
          if (Math.abs(p.vy) > 0.8) playImpactSound(Math.abs(p.vy));
        }

        // Colisión con espinas
        pins.forEach((pin) => {
          const dx = p.x - pin.x;
          const dy = p.y - pin.y;
          const dist = Math.hypot(dx, dy);
          const minDist = p.radius + pin.radius;

          if (dist < minDist) {
            const nx = dx / (dist || 1);
            const ny = dy / (dist || 1);
            p.x = pin.x + nx * minDist;
            p.y = pin.y + ny * minDist;

            const dot = p.vx * nx + p.vy * ny;
            p.vx = (p.vx - 1.5 * dot * nx) * 0.7 + (Math.random() - 0.5) * 0.4;
            p.vy = (p.vy - 1.5 * dot * ny) * 0.7 + (Math.random() - 0.5) * 0.4;

            pin.pulse = 1.0;
            const force = Math.hypot(p.vx, p.vy);
            if (force > 0.5) {
              playImpactSound(force);
            }
          }
        });

        // Dibujar semilla
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        const speed = Math.hypot(p.vx, p.vy);
        totalSpeed += speed;

        if (speed > 2.2) {
          ctx.strokeStyle = "rgba(245, 215, 127, 0.4)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * 1.4, p.y - p.vy * 1.4);
          ctx.stroke();
        }
      });

      ctx.restore();

      // ------------------------------------------
      // MODULACIÓN DE AUDIO POR VELOCIDAD REAL DE SEMILLAS
      // ------------------------------------------
      const avgSpeed = totalSpeed / numParticles;
      if (gainNodeRef.current && filterNodeRef.current && audioCtxRef.current && !isMuted) {
        const ctxAudio = audioCtxRef.current;
        // Volumen reactivo: silencia en reposo, suena como lluvia al fluir
        const targetGain = Math.min(Math.max((avgSpeed - 0.08) * 0.22, 0.0001), 0.32);
        gainNodeRef.current.gain.setTargetAtTime(targetGain, ctxAudio.currentTime, 0.05);

        // Frecuencia acústica modulada por la inclinación y velocidad
        const targetFreq = 600 + Math.min(avgSpeed * 500, 1800);
        filterNodeRef.current.frequency.setTargetAtTime(targetFreq, ctxAudio.currentTime, 0.08);

        if (avgSpeed > 0.8) {
          setActivityState("Cascada de Semillas en Movimiento");
        } else if (avgSpeed > 0.2) {
          setActivityState("Llovizna Mística");
        } else {
          setActivityState("Semillas en Reposo (Inclina tu celular)");
        }
      }

      animId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [hasStarted, isMuted, playImpactSound]);

  // Soporte de emulación exclusiva para Desktop con el mouse
  const handlePointerDown = (e: React.PointerEvent) => {
    // Si ya detectamos sensores reales de movimiento, no usamos mouse
    if (orientationRef.current.hasMotion) return;
    const dy = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
    const dx = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
    orientationRef.current.gx = dx * 1.2;
    orientationRef.current.gy = dy * 1.2;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (orientationRef.current.hasMotion) return;
    if (e.buttons > 0) {
      const dy = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      const dx = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      orientationRef.current.gx = dx * 1.2;
      orientationRef.current.gy = dy * 1.2;
    }
  };

  return (
    <div
      className="relative w-full h-screen bg-[#120904] overflow-hidden select-none touch-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
    >
      {/* ============================================================ */}
      {/* PANTALLA GATEKEEPER                                          */}
      {/* ============================================================ */}
      <AnimatePresence>
        {!hasStarted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-[#1C1008]/98 via-[#120904]/99 to-[#080301] backdrop-blur-2xl"
          >
            <div className="w-20 h-20 mb-6 rounded-3xl border border-amber-400/35 bg-gradient-to-tr from-amber-600/25 via-yellow-500/15 to-transparent flex items-center justify-center shadow-[0_0_40px_rgba(212,175,55,0.3)]">
              <Droplets className="w-9 h-9 text-amber-300 animate-pulse" />
            </div>

            <span className="text-xs uppercase tracking-[0.35em] text-amber-400 font-semibold font-sans mb-2">
              Instrumento Chamánico Táctil
            </span>

            <h1 className="text-3xl sm:text-5xl font-sacred font-bold text-white tracking-wide max-w-lg mb-4">
              Palo de Lluvia Somático
            </h1>

            <p className="max-w-md text-sm sm:text-base text-stone-300 font-sans leading-relaxed mb-8">
              Tu teléfono se convierte en un palo de lluvia de bambú y cuarzo.
              Al <strong>inclinar o girar físicamente tu celular</strong>, las semillas caen y producen el sonido ancestral de la lluvia.
            </p>

            <button
              onClick={requestSensorPermissions}
              className="px-8 py-4 rounded-full border-2 border-[#D4AF37] bg-gradient-to-r from-[#A06B33] via-[#8C4024] to-[#5E3A1A] text-white font-sacred font-bold tracking-widest text-sm sm:text-base uppercase shadow-[0_0_35px_rgba(212,175,55,0.45)] hover:shadow-[0_0_50px_rgba(245,215,127,0.7)] hover:scale-105 active:scale-95 transition-all flex items-center gap-3 cursor-pointer"
            >
              <Smartphone size={20} className="text-amber-200" />
              <span>Sostener y Conectar Giroscopio</span>
            </button>

            <div className="mt-8 flex items-center gap-4 text-xs text-amber-300/80 font-sans">
              <span className="flex items-center gap-1.5">
                <Compass size={14} /> Control Puro por Inclinación
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Activity size={14} /> Audio Reactivo en Tiempo Real
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/* CANVAS DEL INSTRUMENTO                                       */}
      {/* ============================================================ */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* ============================================================ */}
      {/* HUD SUPERIOR MINIMALISTA                                     */}
      {/* ============================================================ */}
      {hasStarted && (
        <>
          <div className="absolute top-4 left-4 right-4 z-40 flex items-center justify-between pointer-events-none">
            {/* Sensor Live Feed */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-[#120904]/75 backdrop-blur-md text-xs text-stone-300 pointer-events-auto">
              <Compass size={14} className="text-amber-400 animate-spin-slow" />
              <span className="font-mono">{sensorDebug}</span>
            </div>

            {/* Acciones */}
            <div className="flex items-center gap-2 pointer-events-auto">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="w-10 h-10 rounded-full border border-white/10 bg-[#120904]/75 backdrop-blur-md flex items-center justify-center text-stone-300 hover:text-white transition-all cursor-pointer"
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} className="text-amber-300" />}
              </button>

              <button
                onClick={() => setShowHelper(!showHelper)}
                className="w-10 h-10 rounded-full border border-white/10 bg-[#120904]/75 backdrop-blur-md flex items-center justify-center text-stone-300 hover:text-white transition-all cursor-pointer"
              >
                <HelpCircle size={18} />
              </button>

              {onExit && (
                <button
                  onClick={onExit}
                  className="w-10 h-10 rounded-full border border-white/10 bg-[#120904]/75 backdrop-blur-md flex items-center justify-center text-stone-300 hover:text-white transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>

          {/* Indicador de Estado Somático Inferior */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-none text-center">
            <div className="px-5 py-2 rounded-full border border-amber-400/25 bg-[#120904]/85 backdrop-blur-lg text-xs text-amber-200/90 font-sans tracking-wider shadow-lg">
              {activityState}
            </div>
          </div>

          {/* Modal de Ayuda */}
          <AnimatePresence>
            {showHelper && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="absolute inset-x-4 top-20 max-w-sm mx-auto z-50 p-5 rounded-2xl border border-amber-400/35 bg-[#1C1008]/95 backdrop-blur-2xl shadow-2xl space-y-3 text-xs text-stone-300"
              >
                <div className="flex items-center justify-between text-amber-300 font-sacred font-bold text-sm">
                  <span>Palo de Lluvia por Inclinación</span>
                  <button onClick={() => setShowHelper(false)} className="cursor-pointer">
                    <X size={16} />
                  </button>
                </div>
                <p>
                  <strong>Giroscopio Nativo:</strong> Sostén tu celular y voltéalo despacio boca abajo o hacia los lados.
                </p>
                <p>
                  Las semillas responden únicamente a la gravedad de tu inclinación física, chocando contra las espinas de bambú.
                </p>
                <p className="text-[11px] text-amber-300/80 italic pt-1 border-t border-white/10">
                  Usa audífonos para una inmersión acústica binaural profunda.
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
