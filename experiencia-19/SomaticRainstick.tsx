"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Volume2, VolumeX, Compass } from "lucide-react";

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
}

interface ObstaclePin {
  x: number;
  y: number;
  radius: number;
  pulse: number;
}

export function SomaticRainstick() {
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [sensorInfo, setSensorInfo] = useState<string>("Balanza tu celular a los lados");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const noiseSourceRef = useRef<AudioBufferSourceNode | null>(null);

  // Vector de Gravedad e Inclinación en useRef (Lectura a 60 FPS sin pausas)
  const physicsRef = useRef<{
    gx: number;
    gy: number;
    tiltAngle: number;
    hasSensor: boolean;
  }>({
    gx: 0,
    gy: 0.6,
    tiltAngle: 0,
    hasSensor: false
  });

  // ============================================================
  // 1. INICIALIZACIÓN AUTOMÁTICA AL CARGAR (CERO PANTALLAS PREVIAS)
  // ============================================================
  useEffect(() => {
    // 1.1 Intentar permisos automáticos de giroscopio en iOS sin bloquear UI
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof (DeviceOrientationEvent as any).requestPermission === "function"
    ) {
      (DeviceOrientationEvent as any)
        .requestPermission()
        .then((state: string) => {
          if (state === "granted") startSensors();
        })
        .catch(() => {});
    }

    // 1.2 Iniciar sensores nativos de inmediato (Android, Chrome, Safari)
    startSensors();

    // 1.3 Desbloquear motor de audio en el primer contacto táctil o movimiento
    const tryUnlockAudio = () => {
      initAudio();
      window.removeEventListener("touchstart", tryUnlockAudio);
      window.removeEventListener("pointerdown", tryUnlockAudio);
    };

    window.addEventListener("touchstart", tryUnlockAudio, { passive: true });
    window.addEventListener("pointerdown", tryUnlockAudio, { passive: true });

    return () => {
      window.removeEventListener("touchstart", tryUnlockAudio);
      window.removeEventListener("pointerdown", tryUnlockAudio);
    };
  }, []);

  const startSensors = () => {
    // Escuchar balanceo del teléfono (Gamma: inclinación izquierda/derecha, Beta: adelante/atrás)
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null || e.beta !== null) {
        physicsRef.current.hasSensor = true;

        const gamma = e.gamma || 0; // -90 a 90 (balanceo lateral)
        const beta = e.beta || 0;   // -180 a 180 (inclinación vertical)

        // Sensibilidad alta en balanceo lateral (lado a lado)
        const radGamma = (gamma * Math.PI) / 180;
        const radBeta = (beta * Math.PI) / 180;

        // Balancear a los lados impulsa fuertemente las semillas en X
        physicsRef.current.gx = Math.sin(radGamma) * 2.2;
        // La inclinación vertical controla la caída en Y
        physicsRef.current.gy = Math.sin(radBeta) * 1.4;
        physicsRef.current.tiltAngle = gamma;

        // Auto-resumir audio si el contexto está pausado
        if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
          audioCtxRef.current.resume().catch(() => {});
        }

        if (Math.abs(gamma) > 8) {
          setSensorInfo(`Balanceando: ${Math.round(gamma)}°`);
        } else {
          setSensorInfo("Balanza tu celular a los lados");
        }
      }
    };

    // Acelerómetro de respaldo para detección instantánea de gravedad física
    const handleMotion = (e: DeviceMotionEvent) => {
      const acc = e.accelerationIncludingGravity;
      if (acc && acc.x !== null) {
        physicsRef.current.hasSensor = true;
        // Invertir X para que coincida con el balanceo natural de la pantalla
        const gx = -(acc.x || 0) / 9.8;
        const gy = (acc.y || 0) / 9.8;
        physicsRef.current.gx = gx * 2.0;
        physicsRef.current.gy = gy * 1.4;

        if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
          audioCtxRef.current.resume().catch(() => {});
        }
      }
    };

    window.addEventListener("deviceorientation", handleOrientation, true);
    window.addEventListener("devicemotion", handleMotion, true);
  };

  // ============================================================
  // 2. MOTOR ACÚSTICO REACTIVO (Web Audio API)
  // ============================================================
  const initAudio = () => {
    if (audioCtxRef.current && audioCtxRef.current.state === "running") return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;
      if (ctx.state === "suspended") {
        ctx.resume().catch(() => {});
      }

      // Buffer de lluvia y fricción de semillas de cuarzo
      const bufferSize = ctx.sampleRate * 2.0;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555;
        b1 = 0.99332 * b1 + white * 0.075;
        b2 = 0.96900 * b2 + white * 0.153;
        let pink = b0 + b1 + b2 + white * 0.35;
        if (Math.random() < 0.04) {
          pink += (Math.random() * 2 - 1) * 2.4;
        }
        data[i] = pink * 0.16;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;
      noiseSource.loop = true;

      // Filtro acústico de bambú hueco
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(800, ctx.currentTime);
      filter.Q.setValueAtTime(3.0, ctx.currentTime);
      filterNodeRef.current = filter;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gainNodeRef.current = gain;

      noiseSource.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noiseSource.start();
      noiseSourceRef.current = noiseSource;
    } catch (e) {}
  };

  const playSeedClick = useCallback((force: number) => {
    if (!audioCtxRef.current || isMuted) return;
    try {
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume().catch(() => {});

      const osc = ctx.createOscillator();
      const clickGain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(1100 + Math.random() * 1900, ctx.currentTime);

      const vol = Math.min(Math.max(force * 0.04, 0.006), 0.07);
      clickGain.gain.setValueAtTime(vol, ctx.currentTime);
      clickGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.022);

      osc.connect(clickGain);
      clickGain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.025);
    } catch (e) {}
  }, [isMuted]);

  // ============================================================
  // 3. FÍSICA Y VISUALIZADOR EN CANVAS 2D A 60 FPS
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

    // Diseño del tubo: Cámara ancha y ergonómica para balanceo lateral
    const chamberPadding = 18;
    const chamberX = chamberPadding;
    const chamberY = 60;
    const chamberWidth = canvas.width - chamberPadding * 2;
    const chamberHeight = canvas.height - 120;

    // Crear 54 espinas internas distribuidas en matriz orgánica
    const pins: ObstaclePin[] = [];
    const cols = 6;
    const rows = 9;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Desfase en zig-zag para que las semillas reboten de lado a lado
        const offsetX = (r % 2 === 0 ? 0.5 : 1.0) * (chamberWidth / (cols + 1));
        const px = chamberX + (c + 0.5) * (chamberWidth / cols) + (r % 2 === 0 ? -12 : 12);
        const py = chamberY + (r + 1) * (chamberHeight / (rows + 1));
        pins.push({
          x: px,
          y: py,
          radius: 3.5,
          pulse: 0
        });
      }
    }

    // 160 semillas de cuarzo y acacia dorada
    const numParticles = 160;
    const particles: Particle[] = [];
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: chamberX + 30 + Math.random() * (chamberWidth - 60),
        y: chamberY + chamberHeight * 0.4 + Math.random() * (chamberHeight * 0.3),
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: 2.2 + Math.random() * 2.6,
        color: Math.random() > 0.35 ? "#F5D77F" : "#D4AF37"
      });
    }

    // Loop a 60 FPS
    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Fondo oscuro bambú y ámbar
      const bgGrad = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        chamberWidth * 0.1,
        canvas.width / 2,
        canvas.height / 2,
        canvas.height * 0.7
      );
      bgGrad.addColorStop(0, "#261308");
      bgGrad.addColorStop(0.65, "#140903");
      bgGrad.addColorStop(1, "#070301");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Gravedad leída del balanceo
      const gx = physicsRef.current.gx;
      const gy = physicsRef.current.gy;

      // ------------------------------------------
      // DIBUJAR CÁMARA SAGRADA DE BAMBÚ
      // ------------------------------------------
      ctx.save();
      ctx.shadowColor = "rgba(0, 0, 0, 0.75)";
      ctx.shadowBlur = 30;

      // Marco de madera
      const woodGrad = ctx.createLinearGradient(chamberX, 0, chamberX + chamberWidth, 0);
      woodGrad.addColorStop(0, "#5A3416");
      woodGrad.addColorStop(0.5, "#9E6831");
      woodGrad.addColorStop(1, "#5A3416");

      ctx.fillStyle = woodGrad;
      ctx.beginPath();
      ctx.roundRect(chamberX, chamberY, chamberWidth, chamberHeight, 28);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Interior Hueco Resonante
      const cavityGrad = ctx.createLinearGradient(chamberX, 0, chamberX + chamberWidth, 0);
      cavityGrad.addColorStop(0, "rgba(18, 8, 3, 0.95)");
      cavityGrad.addColorStop(0.5, "rgba(38, 18, 7, 0.82)");
      cavityGrad.addColorStop(1, "rgba(18, 8, 3, 0.95)");

      ctx.fillStyle = cavityGrad;
      ctx.beginPath();
      ctx.roundRect(chamberX + 8, chamberY + 8, chamberWidth - 16, chamberHeight - 16, 22);
      ctx.fill();

      // Borde Dorado del Palo de Lluvia
      ctx.strokeStyle = "rgba(212, 175, 55, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Espinas internas de bambú
      pins.forEach((pin) => {
        if (pin.pulse > 0) pin.pulse -= 0.05;

        ctx.strokeStyle = "rgba(212, 175, 55, 0.6)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(pin.x - 10, pin.y);
        ctx.lineTo(pin.x + 10, pin.y);
        ctx.stroke();

        ctx.fillStyle = pin.pulse > 0 ? "#FFF5D0" : "#C29B38";
        ctx.beginPath();
        ctx.arc(pin.x, pin.y, pin.radius + Math.max(pin.pulse * 2.2, 0), 0, Math.PI * 2);
        ctx.fill();
      });

      // ------------------------------------------
      // FÍSICA DE SEMILLAS EN BALANCEO LATERAL
      // ------------------------------------------
      let totalSpeed = 0;

      particles.forEach((p) => {
        // Gravedad física directa
        p.vx += gx * 0.48;
        p.vy += gy * 0.42;

        // Fricción
        p.vx *= 0.965;
        p.vy *= 0.965;

        p.x += p.vx;
        p.y += p.vy;

        const minX = chamberX + 12 + p.radius;
        const maxX = chamberX + chamberWidth - 12 - p.radius;
        const minY = chamberY + 12 + p.radius;
        const maxY = chamberY + chamberHeight - 12 - p.radius;

        // Rebotes en paredes laterales
        if (p.x < minX) {
          p.x = minX;
          p.vx = -p.vx * 0.45;
          if (Math.abs(p.vx) > 0.8) playSeedClick(Math.abs(p.vx));
        } else if (p.x > maxX) {
          p.x = maxX;
          p.vx = -p.vx * 0.45;
          if (Math.abs(p.vx) > 0.8) playSeedClick(Math.abs(p.vx));
        }

        // Rebotes arriba y abajo
        if (p.y < minY) {
          p.y = minY;
          p.vy = -p.vy * 0.4;
        } else if (p.y > maxY) {
          p.y = maxY;
          p.vy = -p.vy * 0.4;
          if (Math.abs(p.vy) > 0.8) playSeedClick(Math.abs(p.vy));
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
            p.vx = (p.vx - 1.5 * dot * nx) * 0.72 + (Math.random() - 0.5) * 0.4;
            p.vy = (p.vy - 1.5 * dot * ny) * 0.72 + (Math.random() - 0.5) * 0.4;

            pin.pulse = 1.0;
            const force = Math.hypot(p.vx, p.vy);
            if (force > 0.5) {
              playSeedClick(force);
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

        if (speed > 2.0) {
          ctx.strokeStyle = "rgba(245, 215, 127, 0.35)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * 1.3, p.y - p.vy * 1.3);
          ctx.stroke();
        }
      });

      ctx.restore();

      // ------------------------------------------
      // AUDIO DE LLUVIA POR BALANCEO
      // ------------------------------------------
      const avgSpeed = totalSpeed / numParticles;
      if (gainNodeRef.current && filterNodeRef.current && audioCtxRef.current && !isMuted) {
        const ctxAudio = audioCtxRef.current;
        const targetGain = Math.min(Math.max((avgSpeed - 0.08) * 0.25, 0.0001), 0.38);
        gainNodeRef.current.gain.setTargetAtTime(targetGain, ctxAudio.currentTime, 0.05);

        const targetFreq = 650 + Math.min(avgSpeed * 550, 1900);
        filterNodeRef.current.frequency.setTargetAtTime(targetFreq, ctxAudio.currentTime, 0.08);
      }

      animId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [isMuted, playSeedClick]);

  return (
    <div className="relative w-full h-screen bg-[#120904] overflow-hidden select-none touch-none">
      {/* Canvas del Palo de Lluvia (En vivo desde el primer milisegundo) */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Barra Superior con Lectura de Balanceo */}
      <div className="absolute top-4 left-4 right-4 z-40 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-400/30 bg-[#120904]/80 backdrop-blur-md text-xs text-amber-200 pointer-events-auto shadow-md">
          <Compass size={14} className="text-amber-400 animate-pulse" />
          <span className="font-sans font-medium">{sensorInfo}</span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="w-10 h-10 rounded-full border border-white/10 bg-[#120904]/75 backdrop-blur-md flex items-center justify-center text-stone-300 hover:text-white transition-all cursor-pointer"
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} className="text-amber-300" />}
          </button>
        </div>
      </div>

      {/* Indicador Guía Inferior */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-40 pointer-events-none text-center">
        <div className="px-5 py-2 rounded-full border border-amber-400/25 bg-[#120904]/85 backdrop-blur-lg text-xs text-amber-200/90 font-sans tracking-wider shadow-lg">
          Balanza el celular de izquierda a derecha ↔
        </div>
      </div>
    </div>
  );
}

export default SomaticRainstick;
