"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Volume2, VolumeX, Compass, Music, Sparkles } from "lucide-react";

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

// Escala Pentatónica Armónica Sagrada (432 Hz y 528 Hz Pitagórica / Sonido de Viento y Bambú)
const HARMONIC_NOTES = [432, 528, 648, 720, 864, 1056, 1296];

export function SomaticRainstick() {
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [sensorInfo, setSensorInfo] = useState<string>("Balanza tu celular suavemente");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const harmonicGainRef = useRef<GainNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const noiseSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const harmonicOscRef = useRef<OscillatorNode | null>(null);
  const lastNoteTimeRef = useRef<number>(0);

  // Vector de Gravedad e Inclinación en useRef (Lectura a 60 FPS sin pausas)
  const physicsRef = useRef<{
    gx: number;
    gy: number;
    tiltAngle: number;
    hasSensor: boolean;
  }>({
    gx: 0,
    gy: 0.55,
    tiltAngle: 0,
    hasSensor: false
  });

  // ============================================================
  // 1. INICIALIZACIÓN AUTOMÁTICA AL CARGAR
  // ============================================================
  useEffect(() => {
    // 1.1 Intentar permisos de giroscopio en iOS sin bloquear UI
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

    // 1.2 Iniciar sensores nativos de inmediato
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
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null || e.beta !== null) {
        physicsRef.current.hasSensor = true;

        const gamma = e.gamma || 0; // -90 a 90 (balanceo lateral)
        const beta = e.beta || 0;   // -180 a 180 (inclinación vertical)

        const radGamma = (gamma * Math.PI) / 180;
        const radBeta = (beta * Math.PI) / 180;

        // Impulso suave y reactivo
        physicsRef.current.gx = Math.sin(radGamma) * 2.0;
        physicsRef.current.gy = Math.sin(radBeta) * 1.3;
        physicsRef.current.tiltAngle = gamma;

        if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
          audioCtxRef.current.resume().catch(() => {});
        }

        if (Math.abs(gamma) > 8) {
          setSensorInfo(`Armonizando: ${Math.round(gamma)}°`);
        } else {
          setSensorInfo("Balanza tu celular suavemente");
        }
      }
    };

    const handleMotion = (e: DeviceMotionEvent) => {
      const acc = e.accelerationIncludingGravity;
      if (acc && acc.x !== null) {
        physicsRef.current.hasSensor = true;
        const gx = -(acc.x || 0) / 9.8;
        const gy = (acc.y || 0) / 9.8;
        physicsRef.current.gx = gx * 1.8;
        physicsRef.current.gy = gy * 1.3;

        if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
          audioCtxRef.current.resume().catch(() => {});
        }
      }
    };

    window.addEventListener("deviceorientation", handleOrientation, true);
    window.addEventListener("devicemotion", handleMotion, true);
  };

  // ============================================================
  // 2. MOTOR ACÚSTICO TENUE Y ARMÓNICO (Web Audio API)
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

      // 2.1 Ruido Marrón Sedoso (Lluvia de fondo muy tenue, sin siseo estridente)
      const bufferSize = ctx.sampleRate * 2.5;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Filtro browniano (integración suave de ruido para textura cálida de seda)
        lastOut = (lastOut + 0.02 * white) / 1.02;
        data[i] = lastOut * 0.45;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;
      noiseSource.loop = true;

      // Filtro Lowpass suave a 520 Hz (elimina todo siseo metálico agudo)
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(520, ctx.currentTime);
      filter.Q.setValueAtTime(1.2, ctx.currentTime);
      filterNodeRef.current = filter;

      // Ganancia master tenue para la lluvia
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gainNodeRef.current = gain;

      noiseSource.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noiseSource.start();
      noiseSourceRef.current = noiseSource;

      // 2.2 Resonador Armónico Sagrado a 432 Hz (Fondo Etereo de Meditación)
      const oscHarmonic = ctx.createOscillator();
      oscHarmonic.type = "sine";
      oscHarmonic.frequency.setValueAtTime(432, ctx.currentTime);

      const harmGain = ctx.createGain();
      harmGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      harmonicGainRef.current = harmGain;

      oscHarmonic.connect(harmGain);
      harmGain.connect(ctx.destination);

      oscHarmonic.start();
      harmonicOscRef.current = oscHarmonic;
    } catch (e) {
      console.warn("Audio init warning:", e);
    }
  };

  // 2.3 Gotas / Semillas Armónicas en Escala Pentatónica (Sonido Cristalino y Suave)
  const playHarmonicSeedNote = useCallback((force: number) => {
    if (!audioCtxRef.current || isMuted) return;
    const now = Date.now();
    // Limitar cadencia para que no se sature de notas (máximo 1 cada 50ms)
    if (now - lastNoteTimeRef.current < 50) return;
    lastNoteTimeRef.current = now;

    try {
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume().catch(() => {});

      const osc = ctx.createOscillator();
      const clickGain = ctx.createGain();

      // Seleccionar una nota de la escala armónica sagrada
      const noteFreq = HARMONIC_NOTES[Math.floor(Math.random() * HARMONIC_NOTES.length)];
      osc.type = "sine";
      osc.frequency.setValueAtTime(noteFreq, ctx.currentTime);

      // Volumen tenue y aterciopelado
      const vol = Math.min(Math.max(force * 0.018, 0.004), 0.028);
      clickGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      clickGain.gain.linearRampToValueAtTime(vol, ctx.currentTime + 0.008);
      clickGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);

      osc.connect(clickGain);
      clickGain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.085);
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

    const chamberPadding = 18;
    const chamberX = chamberPadding;
    const chamberY = 60;
    const chamberWidth = canvas.width - chamberPadding * 2;
    const chamberHeight = canvas.height - 120;

    // 54 espinas internas en distribución orgánica
    const pins: ObstaclePin[] = [];
    const cols = 6;
    const rows = 9;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const px = chamberX + (c + 0.5) * (chamberWidth / cols) + (r % 2 === 0 ? -10 : 10);
        const py = chamberY + (r + 1) * (chamberHeight / (rows + 1));
        pins.push({
          x: px,
          y: py,
          radius: 3.2,
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
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        radius: 2.2 + Math.random() * 2.4,
        color: Math.random() > 0.35 ? "#F5D77F" : "#D4AF37"
      });
    }

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Fondo ambiente terroso
      const bgGrad = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        chamberWidth * 0.1,
        canvas.width / 2,
        canvas.height / 2,
        canvas.height * 0.7
      );
      bgGrad.addColorStop(0, "#241308");
      bgGrad.addColorStop(0.65, "#140903");
      bgGrad.addColorStop(1, "#070301");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const gx = physicsRef.current.gx;
      const gy = physicsRef.current.gy;

      // Marco de bambú
      ctx.save();
      ctx.shadowColor = "rgba(0, 0, 0, 0.75)";
      ctx.shadowBlur = 30;

      const woodGrad = ctx.createLinearGradient(chamberX, 0, chamberX + chamberWidth, 0);
      woodGrad.addColorStop(0, "#553215");
      woodGrad.addColorStop(0.5, "#9E6831");
      woodGrad.addColorStop(1, "#553215");

      ctx.fillStyle = woodGrad;
      ctx.beginPath();
      ctx.roundRect(chamberX, chamberY, chamberWidth, chamberHeight, 28);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Cavidad interior resonante
      const cavityGrad = ctx.createLinearGradient(chamberX, 0, chamberX + chamberWidth, 0);
      cavityGrad.addColorStop(0, "rgba(18, 8, 3, 0.95)");
      cavityGrad.addColorStop(0.5, "rgba(38, 18, 7, 0.82)");
      cavityGrad.addColorStop(1, "rgba(18, 8, 3, 0.95)");

      ctx.fillStyle = cavityGrad;
      ctx.beginPath();
      ctx.roundRect(chamberX + 8, chamberY + 8, chamberWidth - 16, chamberHeight - 16, 22);
      ctx.fill();

      // Ribete sutil dorado
      ctx.strokeStyle = "rgba(212, 175, 55, 0.35)";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Espinas internas
      pins.forEach((pin) => {
        if (pin.pulse > 0) pin.pulse -= 0.04;

        ctx.strokeStyle = "rgba(212, 175, 55, 0.5)";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(pin.x - 9, pin.y);
        ctx.lineTo(pin.x + 9, pin.y);
        ctx.stroke();

        ctx.fillStyle = pin.pulse > 0 ? "#FFF8E0" : "#C29B38";
        ctx.beginPath();
        ctx.arc(pin.x, pin.y, pin.radius + Math.max(pin.pulse * 1.8, 0), 0, Math.PI * 2);
        ctx.fill();
      });

      // Física de semillas
      let totalSpeed = 0;

      particles.forEach((p) => {
        p.vx += gx * 0.44;
        p.vy += gy * 0.40;

        p.vx *= 0.965;
        p.vy *= 0.965;

        p.x += p.vx;
        p.y += p.vy;

        const minX = chamberX + 12 + p.radius;
        const maxX = chamberX + chamberWidth - 12 - p.radius;
        const minY = chamberY + 12 + p.radius;
        const maxY = chamberY + chamberHeight - 12 - p.radius;

        if (p.x < minX) {
          p.x = minX;
          p.vx = -p.vx * 0.42;
          if (Math.abs(p.vx) > 0.9) playHarmonicSeedNote(Math.abs(p.vx));
        } else if (p.x > maxX) {
          p.x = maxX;
          p.vx = -p.vx * 0.42;
          if (Math.abs(p.vx) > 0.9) playHarmonicSeedNote(Math.abs(p.vx));
        }

        if (p.y < minY) {
          p.y = minY;
          p.vy = -p.vy * 0.38;
        } else if (p.y > maxY) {
          p.y = maxY;
          p.vy = -p.vy * 0.38;
          if (Math.abs(p.vy) > 0.9) playHarmonicSeedNote(Math.abs(p.vy));
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
            p.vx = (p.vx - 1.5 * dot * nx) * 0.7 + (Math.random() - 0.5) * 0.35;
            p.vy = (p.vy - 1.5 * dot * ny) * 0.7 + (Math.random() - 0.5) * 0.35;

            pin.pulse = 1.0;
            const force = Math.hypot(p.vx, p.vy);
            if (force > 0.6) {
              playHarmonicSeedNote(force);
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
          ctx.strokeStyle = "rgba(245, 215, 127, 0.3)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * 1.2, p.y - p.vy * 1.2);
          ctx.stroke();
        }
      });

      ctx.restore();

      // ==========================================
      // MODULACIÓN ACÚSTICA TENUE Y ARMÓNICA
      // ==========================================
      const avgSpeed = totalSpeed / numParticles;
      if (audioCtxRef.current && !isMuted) {
        const ctxAudio = audioCtxRef.current;

        // 1. Ganancia de Lluvia Marrón: Muy suave y tenue (máximo 0.08)
        if (gainNodeRef.current) {
          const targetGain = Math.min(Math.max((avgSpeed - 0.08) * 0.08, 0.0001), 0.08);
          gainNodeRef.current.gain.setTargetAtTime(targetGain, ctxAudio.currentTime, 0.08);
        }

        // 2. Resonancia Armónica Sagrada a 432 Hz: Acompaña el balanceo
        if (harmonicGainRef.current) {
          const targetHarm = Math.min(Math.max((avgSpeed - 0.06) * 0.025, 0.0001), 0.03);
          harmonicGainRef.current.gain.setTargetAtTime(targetHarm, ctxAudio.currentTime, 0.1);
        }

        // 3. Filtro acústico cálido
        if (filterNodeRef.current) {
          const targetFreq = 420 + Math.min(avgSpeed * 220, 680);
          filterNodeRef.current.frequency.setTargetAtTime(targetFreq, ctxAudio.currentTime, 0.1);
        }
      }

      animId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [isMuted, playHarmonicSeedNote]);

  return (
    <div className="relative w-full h-screen bg-[#120904] overflow-hidden select-none touch-none">
      {/* Canvas del Palo de Lluvia */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Barra Superior */}
      <div className="absolute top-4 left-4 right-4 z-40 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-400/25 bg-[#120904]/80 backdrop-blur-md text-xs text-amber-200 pointer-events-auto shadow-sm">
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
        <div className="flex items-center gap-2 px-5 py-2 rounded-full border border-amber-400/20 bg-[#120904]/85 backdrop-blur-lg text-xs text-amber-200/90 font-sans tracking-wider shadow-lg">
          <Sparkles size={14} className="text-amber-400" />
          <span>Balanza de izquierda a derecha ↔ Acústica Sagrada</span>
        </div>
      </div>
    </div>
  );
}

export default SomaticRainstick;
