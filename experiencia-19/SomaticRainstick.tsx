"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Volume2,
  VolumeX,
  X,
  Compass,
  HelpCircle,
  Smartphone
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
  // Estados de UI y control (Inicia activo por defecto)
  const [hasStarted, setHasStarted] = useState<boolean>(true);
  const [needsIosTap, setNeedsIosTap] = useState<boolean>(false);
  const [isAudioUnlocked, setIsAudioUnlocked] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showHelper, setShowHelper] = useState<boolean>(false);
  const [sensorDebug, setSensorDebug] = useState<string>("Conectando giroscopio...");
  const [activityState, setActivityState] = useState<string>("Sintonizando gravedad...");

  // Referencias para evitar re-renderizados del Canvas o Audio
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const noiseSourceRef = useRef<AudioBufferSourceNode | null>(null);

  // Vector de Gravedad e Inclinación en useRef (Lectura directa a 60 FPS)
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
    gy: 0.9,
    hasMotion: false
  });

  // ============================================================
  // 1. AUTO-ACTIVACIÓN INMEDIATA DEL GIROSCOPIO Y SENSORES
  // ============================================================
  useEffect(() => {
    // 1.1 Iniciar de inmediato los listeners nativos (Android, Chrome, Firefox)
    startSensorListeners();

    // 1.2 Verificar si es iOS Safari que exige permiso explícito
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof (DeviceOrientationEvent as any).requestPermission === "function"
    ) {
      // Intentar solicitarlo inmediatamente
      (DeviceOrientationEvent as any)
        .requestPermission()
        .then((response: string) => {
          if (response === "granted") {
            setNeedsIosTap(false);
          } else {
            setNeedsIosTap(true);
          }
        })
        .catch(() => {
          // iOS bloqueó la llamada automática sin gesto: mostramos banner de un toque
          setNeedsIosTap(true);
        });
    }

    // 1.3 Desbloquear audio al primer toque o interacción
    const unlockAudio = () => {
      initAudio();
      window.removeEventListener("touchstart", unlockAudio);
      window.removeEventListener("click", unlockAudio);
    };

    window.addEventListener("touchstart", unlockAudio, { passive: true });
    window.addEventListener("click", unlockAudio, { passive: true });

    // Telemetría
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "start_experience", { experience_name: "Palo de Lluvia" });
    }

    return () => {
      window.removeEventListener("touchstart", unlockAudio);
      window.removeEventListener("click", unlockAudio);
    };
  }, []);

  // Función para iOS cuando requiere gesto de usuario para lanzar el diálogo del sistema
  const handleIosPermissionTap = async () => {
    try {
      if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof (DeviceOrientationEvent as any).requestPermission === "function"
      ) {
        const state = await (DeviceOrientationEvent as any).requestPermission();
        if (state === "granted") {
          setNeedsIosTap(false);
          startSensorListeners();
        }
      }
      if (
        typeof DeviceMotionEvent !== "undefined" &&
        typeof (DeviceMotionEvent as any).requestPermission === "function"
      ) {
        await (DeviceMotionEvent as any).requestPermission();
      }
    } catch (e) {
      console.warn("Permiso iOS:", e);
    }
    initAudio();
    setNeedsIosTap(false);
  };

  const startSensorListeners = () => {
    // Listener de Orientación (Ángulos Beta y Gamma)
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta !== null && e.gamma !== null) {
        orientationRef.current.beta = e.beta;
        orientationRef.current.gamma = e.gamma;
        orientationRef.current.hasMotion = true;

        const radBeta = (e.beta * Math.PI) / 180;
        const radGamma = (e.gamma * Math.PI) / 180;

        orientationRef.current.gx = Math.sin(radGamma) * 1.25;
        orientationRef.current.gy = Math.sin(radBeta) * 1.25;

        setSensorDebug(`β: ${Math.round(e.beta)}° | γ: ${Math.round(e.gamma)}°`);
      }
    };

    // Listener de Movimiento / Acelerómetro (Respaldo directo de gravedad)
    const handleMotion = (e: DeviceMotionEvent) => {
      const acc = e.accelerationIncludingGravity;
      if (acc && acc.x !== null && acc.y !== null) {
        orientationRef.current.hasMotion = true;
        const gx = -(acc.x || 0) / 9.8;
        const gy = (acc.y || 0) / 9.8;
        orientationRef.current.gx = Math.max(-1.5, Math.min(1.5, gx * 1.2));
        orientationRef.current.gy = Math.max(-1.5, Math.min(1.5, gy * 1.2));
      }
    };

    window.addEventListener("deviceorientation", handleOrientation, true);
    window.addEventListener("devicemotion", handleMotion, true);
  };

  // ============================================================
  // 2. MOTOR DE AUDIO GRANULAR REACTIVO (Web Audio API)
  // ============================================================
  const initAudio = () => {
    if (audioCtxRef.current && audioCtxRef.current.state === "running") return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const bufferSize = ctx.sampleRate * 2.0;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555;
        b1 = 0.99332 * b1 + white * 0.075;
        b2 = 0.96900 * b2 + white * 0.153;
        let pink = b0 + b1 + b2 + white * 0.3;
        if (Math.random() < 0.035) {
          pink += (Math.random() * 2 - 1) * 2.2;
        }
        data[i] = pink * 0.18;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;
      noiseSource.loop = true;

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
      setIsAudioUnlocked(true);
    } catch (e) {
      console.warn("Audio init warning:", e);
    }
  };

  const playImpactSound = useCallback((force: number) => {
    if (!audioCtxRef.current || isMuted) return;
    try {
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();

      const osc = ctx.createOscillator();
      const clickGain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(1200 + Math.random() * 1800, ctx.currentTime);

      const vol = Math.min(Math.max(force * 0.035, 0.006), 0.06);
      clickGain.gain.setValueAtTime(vol, ctx.currentTime);
      clickGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.02);

      osc.connect(clickGain);
      clickGain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.025);
    } catch (e) {}
  }, [isMuted]);

  // ============================================================
  // 3. FÍSICA VISUAL PERSISTENTE EN CANVAS 2D A 60 FPS
  // ============================================================
  useEffect(() => {
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
        y: tubeY + tubeHeight * 0.35 + Math.random() * (tubeHeight * 0.3),
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        radius: 2.2 + Math.random() * 2.5,
        color: Math.random() > 0.4 ? "#F5D77F" : "#D4AF37",
        glow: "rgba(245, 215, 127, 0.6)"
      });
    }

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

      const gx = orientationRef.current.gx;
      const gy = orientationRef.current.gy;

      // ------------------------------------------
      // DIBUJAR TUBO DE BAMBÚ
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

      // Anillos del bambú
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
        p.vx += gx * 0.45;
        p.vy += gy * 0.45;

        p.vx *= 0.965;
        p.vy *= 0.965;

        p.x += p.vx;
        p.y += p.vy;

        const minX = tubeX + 12 + p.radius;
        const maxX = tubeX + tubeWidth - 12 - p.radius;
        const minY = tubeY + 12 + p.radius;
        const maxY = tubeY + tubeHeight - 12 - p.radius;

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
      // AUDIO REACTIVO
      // ------------------------------------------
      const avgSpeed = totalSpeed / numParticles;
      if (gainNodeRef.current && filterNodeRef.current && audioCtxRef.current && !isMuted) {
        const ctxAudio = audioCtxRef.current;
        const targetGain = Math.min(Math.max((avgSpeed - 0.08) * 0.24, 0.0001), 0.35);
        gainNodeRef.current.gain.setTargetAtTime(targetGain, ctxAudio.currentTime, 0.05);

        const targetFreq = 600 + Math.min(avgSpeed * 520, 1850);
        filterNodeRef.current.frequency.setTargetAtTime(targetFreq, ctxAudio.currentTime, 0.08);

        if (avgSpeed > 0.8) {
          setActivityState("Torrente de Semillas");
        } else if (avgSpeed > 0.2) {
          setActivityState("Llovizna Mística");
        } else {
          setActivityState("Reposo (Inclina tu celular)");
        }
      }

      animId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [isMuted, playImpactSound]);

  return (
    <div className="relative w-full h-screen bg-[#120904] overflow-hidden select-none touch-none">
      {/* ============================================================ */}
      {/* MODAL DE AUTORIZACIÓN AUTOMÁTICA EN IOS (SI LO REQUIERE)     */}
      {/* ============================================================ */}
      <AnimatePresence>
        {needsIosTap && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onClick={handleIosPermissionTap}
            className="absolute top-16 inset-x-4 max-w-sm mx-auto z-50 p-4 rounded-2xl border-2 border-amber-400 bg-gradient-to-r from-[#A06B33] via-[#8C4024] to-[#5E3A1A] text-white shadow-[0_0_30px_rgba(212,175,55,0.6)] cursor-pointer flex items-center justify-between gap-3 animate-pulse"
          >
            <div className="flex items-center gap-3">
              <Smartphone size={22} className="text-amber-200" />
              <div>
                <p className="text-xs font-bold font-sacred tracking-wider uppercase">
                  Activar Giroscopio
                </p>
                <p className="text-[11px] text-stone-200">
                  Toca aquí para permitir el movimiento
                </p>
              </div>
            </div>
            <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">
              Permitir
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/* CANVAS DEL INSTRUMENTO (INICIA DE INMEDIATO)                 */}
      {/* ============================================================ */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* ============================================================ */}
      {/* HUD SUPERIOR MINIMALISTA                                     */}
      {/* ============================================================ */}
      <div className="absolute top-4 left-4 right-4 z-40 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-[#120904]/75 backdrop-blur-md text-xs text-stone-300 pointer-events-auto">
          <Compass size={14} className="text-amber-400" />
          <span className="font-mono">{sensorDebug}</span>
        </div>

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
              El instrumento está activo directamente con el sensor de tu teléfono.
            </p>
            <p>
              Inclínalo despacio o voltéalo boca abajo para que las semillas caigan con gravedad real.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SomaticRainstick;
