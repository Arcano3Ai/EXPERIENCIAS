"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Volume2,
  VolumeX,
  Compass,
  Sparkles,
  RotateCw,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  Sliders,
  Info,
  Waves,
  Feather,
  Gem,
  Coffee
} from "lucide-react";

// ============================================================================
// TIPOS Y MODELOS DE DATOS
// ============================================================================

export type SeedMaterial = "acacia" | "cuarzo" | "cafe";
export type InteractionMode = "gyro" | "pointer" | "auto";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  glowColor: string;
  mass: number;
  trail: { x: number; y: number }[];
}

interface ObstaclePin {
  x: number;
  y: number;
  radius: number;
  pulse: number;
  angle: number;
  length: number;
}

const MATERIAL_PROFILES: Record<
  SeedMaterial,
  {
    name: string;
    description: string;
    bandpassFreq: number;
    bandpassQ: number;
    lowpassCutoff: number;
    colorA: string;
    colorB: string;
    glow: string;
    grainPitchBase: number;
    friction: number;
    bounciness: number;
    icon: typeof Feather;
  }
> = {
  acacia: {
    name: "Semillas de Acacia",
    description: "Tono cálido, terroso y orgánico. Lluvia suave en follaje.",
    bandpassFreq: 1100,
    bandpassQ: 2.2,
    lowpassCutoff: 3200,
    colorA: "#D4AF37",
    colorB: "#A06B33",
    glow: "rgba(212, 175, 55, 0.45)",
    grainPitchBase: 432,
    friction: 0.965,
    bounciness: 0.42,
    icon: Feather
  },
  cuarzo: {
    name: "Micro-Cuarzos Sagrados",
    description: "Tono luminoso y cristalino. Cascada de luz y alta vibración.",
    bandpassFreq: 2150,
    bandpassQ: 3.5,
    lowpassCutoff: 4800,
    colorA: "#F5E6B8",
    colorB: "#E0F2FE",
    glow: "rgba(224, 242, 254, 0.6)",
    grainPitchBase: 528,
    friction: 0.978,
    bounciness: 0.58,
    icon: Gem
  },
  cafe: {
    name: "Granos de Café Ancestral",
    description: "Tono profundo y denso. Masaje acústico de enraizamiento.",
    bandpassFreq: 720,
    bandpassQ: 1.8,
    lowpassCutoff: 2200,
    colorA: "#6B3A19",
    colorB: "#3D1F0C",
    glow: "rgba(107, 58, 25, 0.5)",
    grainPitchBase: 216,
    friction: 0.952,
    bounciness: 0.32,
    icon: Coffee
  }
};

const SOLFEGGIO_GRAINS = [216, 288, 324, 384, 432, 528, 648];

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export function SomaticRainstick() {
  // Estados de control de la experiencia
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [masterVolume, setMasterVolume] = useState<number>(0.8);
  const [material, setMaterial] = useState<SeedMaterial>("acacia");
  const [mode, setInteractionMode] = useState<InteractionMode>("gyro");
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showConfig, setShowConfig] = useState<boolean>(false);
  const [sensorStatus, setSensorStatus] = useState<string>("Esperando conexión");
  const [activeSpeedKm, setActiveSpeedKm] = useState<number>(0);
  const [flowIntensity, setFlowIntensity] = useState<number>(0);
  const [tubeAngleDeg, setTubeAngleDeg] = useState<number>(0);
  const [breathPhase, setBreathPhase] = useState<string>("Inhala");

  // Referencias de elementos del DOM y Web Audio
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);

  // Nodos de Audio para Capa Continua de Fricción Granular
  const noiseSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const noiseGainRef = useRef<GainNode | null>(null);
  const noiseBandpassRef = useRef<BiquadFilterNode | null>(null);
  const noiseLowpassRef = useRef<BiquadFilterNode | null>(null);

  // Nodos de Resonancia de Cuerpo de Madera Hueca (Bamboo Body)
  const bambooOscRef = useRef<OscillatorNode | null>(null);
  const bambooGainRef = useRef<GainNode | null>(null);
  const lastGrainTimeRef = useRef<number>(0);

  // Estado de física en useRef para lectura a 60 FPS
  const physicsRef = useRef<{
    gx: number;
    gy: number;
    angle: number; // en radianes
    targetAngle: number;
    hasHardwareSensor: boolean;
    flipOffset: number;
    autoPhase: number;
    materialKey: SeedMaterial;
  }>({
    gx: 0,
    gy: 0.55,
    angle: 0,
    targetAngle: 0,
    hasHardwareSensor: false,
    flipOffset: 0,
    autoPhase: 0,
    materialKey: "acacia"
  });

  // Mantener sincronizado el material activo en la física
  useEffect(() => {
    physicsRef.current.materialKey = material;
  }, [material]);

  // ============================================================================
  // INICIALIZACIÓN DEL MOTOR DE AUDIO PROCEDURAL (SÍNTESIS GRANULAR)
  // ============================================================================
  const initAudioEngine = useCallback(async () => {
    if (audioCtxRef.current && audioCtxRef.current.state === "running") {
      return;
    }

    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtxClass();
      audioCtxRef.current = ctx;

      if (ctx.state === "suspended") {
        await ctx.resume();
      }

      // Master Gain
      const master = ctx.createGain();
      master.gain.setValueAtTime(masterVolume, ctx.currentTime);
      master.connect(ctx.destination);
      masterGainRef.current = master;

      // 1. Capa de Ruido Blanco / Rosa Granular Continuo (Fricción de Semillas)
      const bufferSize = ctx.sampleRate * 4; // 4 segundos de textura continua en bucle
      const noiseBuffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);
      for (let channel = 0; channel < 2; channel++) {
        const data = noiseBuffer.getChannelData(channel);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          // Generación de Ruido Rosa suave (1/f) para simular roce de corteza
          const white = Math.random() * 2 - 1;
          data[i] = (lastOut + 0.025 * white) / 1.025;
          lastOut = data[i];
          data[i] *= 3.5; // Normalización
        }
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      // Filtro Pasa-Banda modulable por ángulo y velocidad
      const bandpass = ctx.createBiquadFilter();
      bandpass.type = "bandpass";
      bandpass.frequency.setValueAtTime(
        MATERIAL_PROFILES[material].bandpassFreq,
        ctx.currentTime
      );
      bandpass.Q.setValueAtTime(MATERIAL_PROFILES[material].bandpassQ, ctx.currentTime);
      noiseBandpassRef.current = bandpass;

      // Filtro Pasa-Bajo para amortiguar frecuencias ásperas
      const lowpass = ctx.createBiquadFilter();
      lowpass.type = "lowpass";
      lowpass.frequency.setValueAtTime(
        MATERIAL_PROFILES[material].lowpassCutoff,
        ctx.currentTime
      );
      noiseLowpassRef.current = lowpass;

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      noiseGainRef.current = noiseGain;

      noiseSource.connect(bandpass);
      bandpass.connect(lowpass);
      lowpass.connect(noiseGain);
      noiseGain.connect(master);
      noiseSource.start(0);
      noiseSourceRef.current = noiseSource;

      // 2. Capa Resonante de Bambú Sagrado (Oscilador afinado a 216 Hz / 432 Hz)
      const bambooOsc = ctx.createOscillator();
      bambooOsc.type = "sine";
      bambooOsc.frequency.setValueAtTime(216, ctx.currentTime);

      const bambooFilter = ctx.createBiquadFilter();
      bambooFilter.type = "bandpass";
      bambooFilter.frequency.setValueAtTime(216, ctx.currentTime);
      bambooFilter.Q.setValueAtTime(4.0, ctx.currentTime);

      const bambooGain = ctx.createGain();
      bambooGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      bambooGainRef.current = bambooGain;

      bambooOsc.connect(bambooFilter);
      bambooFilter.connect(bambooGain);
      bambooGain.connect(master);
      bambooOsc.start(0);
      bambooOscRef.current = bambooOsc;
    } catch (err) {
      console.warn("Fallo al iniciar el motor de audio:", err);
    }
  }, [material, masterVolume]);

  // Actualizar volumen maestro
  useEffect(() => {
    if (masterGainRef.current && audioCtxRef.current) {
      const vol = isMuted ? 0 : masterVolume;
      masterGainRef.current.gain.setTargetAtTime(
        vol,
        audioCtxRef.current.currentTime,
        0.05
      );
    }
  }, [masterVolume, isMuted]);

  // Actualizar perfiles de filtro cuando cambia el material
  useEffect(() => {
    if (
      audioCtxRef.current &&
      noiseBandpassRef.current &&
      noiseLowpassRef.current
    ) {
      const prof = MATERIAL_PROFILES[material];
      const now = audioCtxRef.current.currentTime;
      noiseBandpassRef.current.frequency.setTargetAtTime(prof.bandpassFreq, now, 0.1);
      noiseBandpassRef.current.Q.setTargetAtTime(prof.bandpassQ, now, 0.1);
      noiseLowpassRef.current.frequency.setTargetAtTime(prof.lowpassCutoff, now, 0.1);
    }
  }, [material]);

  // Generador de Granos Acústicos Discretos (Micro-impactos en espinas)
  const triggerGrainSound = useCallback(
    (impulse: number, customFreq?: number) => {
      if (!audioCtxRef.current || isMuted || !masterGainRef.current) return;
      const ctx = audioCtxRef.current;
      const now = Date.now();

      // Limitador acústico de densidad: máximo 1 grano cada 32 ms para evitar saturación
      if (now - lastGrainTimeRef.current < 32) return;
      lastGrainTimeRef.current = now;

      try {
        const prof = MATERIAL_PROFILES[physicsRef.current.materialKey];
        const osc = ctx.createOscillator();
        const grainGain = ctx.createGain();
        const grainFilter = ctx.createBiquadFilter();

        // Frecuencia armónica de bambú / Solfeggio
        const freq =
          customFreq ||
          SOLFEGGIO_GRAINS[Math.floor(Math.random() * SOLFEGGIO_GRAINS.length)];
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq + (Math.random() - 0.5) * 20, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq, ctx.currentTime + 0.04);

        grainFilter.type = "bandpass";
        grainFilter.frequency.setValueAtTime(prof.bandpassFreq, ctx.currentTime);
        grainFilter.Q.setValueAtTime(prof.bandpassQ, ctx.currentTime);

        const amp = Math.min(Math.max(impulse * 0.04, 0.008), 0.065);
        grainGain.gain.setValueAtTime(0.0001, ctx.currentTime);
        grainGain.gain.linearRampToValueAtTime(amp, ctx.currentTime + 0.006);
        grainGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);

        osc.connect(grainFilter);
        grainFilter.connect(grainGain);
        grainGain.connect(masterGainRef.current);

        osc.start();
        osc.stop(ctx.currentTime + 0.14);

        // Feedback háptico en móviles (si está disponible)
        if (
          impulse > 1.2 &&
          typeof navigator !== "undefined" &&
          "vibrate" in navigator
        ) {
          try {
            navigator.vibrate(8);
          } catch (_) {}
        }
      } catch (_) {}
    },
    [isMuted]
  );

  // ============================================================================
  // ACTIVACIÓN DEL GATEKEEPER / CONEXIÓN SAGRADA
  // ============================================================================
  const handleStartExperience = async () => {
    // 1. Inicializar audio en el gesto de usuario
    await initAudioEngine();

    // 2. Solicitar permiso de sensores en iOS si es necesario
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof (DeviceOrientationEvent as any).requestPermission === "function"
    ) {
      try {
        const state = await (DeviceOrientationEvent as any).requestPermission();
        if (state === "granted") {
          registerSensors();
        }
      } catch (e) {
        console.log("Permiso giroscopio no solicitado o denegado:", e);
      }
    } else {
      registerSensors();
    }

    setHasStarted(true);
    setSensorStatus("Instrumento Conectado · Flujo Listo");
  };

  // ============================================================================
  // SENSORES DE GIROSCOPIO Y ACELERÓMETRO
  // ============================================================================
  const registerSensors = () => {
    const onOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta !== null || e.gamma !== null) {
        physicsRef.current.hasHardwareSensor = true;
        const beta = e.beta || 0; // -180 a 180 (vertical)
        const gamma = e.gamma || 0; // -90 a 90 (lateral)

        // En modo giroscopio móvil, el ángulo longitudinal se extrae de beta y gamma
        const radBeta = (beta * Math.PI) / 180;
        const radGamma = (gamma * Math.PI) / 180;

        // Vector de gravedad suavizado
        physicsRef.current.gx = Math.sin(radGamma) * 1.8;
        physicsRef.current.gy = Math.sin(radBeta) * 1.4;

        // Ángulo de inclinación del tubo
        const angle = Math.atan2(physicsRef.current.gx, physicsRef.current.gy);
        physicsRef.current.targetAngle = angle + physicsRef.current.flipOffset;

        setTubeAngleDeg(Math.round((angle * 180) / Math.PI));
        setSensorStatus(`Giroscopio Móvil: ${Math.round((angle * 180) / Math.PI)}°`);
      }
    };

    window.addEventListener("deviceorientation", onOrientation, true);
    return () => {
      window.removeEventListener("deviceorientation", onOrientation, true);
    };
  };

  // Manejo de Interacción por Ratón / Cursor (Desktop Fallback)
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (mode !== "pointer" && physicsRef.current.hasHardwareSensor) return;

      const normX = (e.clientX / window.innerWidth - 0.5) * 2; // -1 a 1
      const normY = (e.clientY / window.innerHeight - 0.5) * 2; // -1 a 1

      // Inclinación reactiva a la posición del cursor en pantalla
      physicsRef.current.gx = normX * 1.7;
      physicsRef.current.gy = 0.5 + normY * 0.4;

      const angle = normX * (Math.PI / 4); // Hasta ±45 grados
      physicsRef.current.targetAngle = angle + physicsRef.current.flipOffset;

      setTubeAngleDeg(Math.round((angle * 180) / Math.PI));
      if (!physicsRef.current.hasHardwareSensor) {
        setSensorStatus(`Control por Cursor: ${Math.round((angle * 180) / Math.PI)}°`);
      }
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [mode]);

  // Voltear el palo de lluvia 180 grados manualmente (ritual de inversión)
  const flipRainstick = () => {
    physicsRef.current.flipOffset += Math.PI;
    // Impulso extra a la gravedad
    physicsRef.current.gy = -physicsRef.current.gy;
    physicsRef.current.gx = -physicsRef.current.gx;
    triggerGrainSound(1.5, 528);
    setSensorStatus("Palo Invertido 180° · Cascada en curso");
  };

  // Toggle de Pantalla Completa
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // ============================================================================
  // LOOP DE FÍSICA Y RENDERIZADO VISUAL EN CANVAS 2D A 60 FPS
  // ============================================================================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    // Dimensiones y geometría del cilindro ceremonial
    let stickWidth = 140;
    let stickHeight = 580;
    let stickCenterX = canvas.width / 2;
    let stickCenterY = canvas.height / 2;
    let pins: ObstaclePin[] = [];

    const rebuildGeometry = (w: number, h: number) => {
      stickCenterX = w / 2;
      stickCenterY = h / 2;

      // El cilindro de palo de lluvia debe ser esbelto y largo
      if (w < 640) {
        // En móviles verticales: ocupa el 72% del alto
        stickWidth = Math.min(130, w * 0.34);
        stickHeight = Math.min(620, h * 0.74);
      } else {
        // En pantallas de escritorio: cilindro ceremonial elegante centrado
        stickWidth = Math.min(160, w * 0.18);
        stickHeight = Math.min(680, h * 0.72);
      }

      // Generar espinas en espiral interna (Cactus Thorns)
      pins = [];
      const rows = 24;
      for (let i = 0; i < rows; i++) {
        const progress = (i + 1) / (rows + 1); // 0 a 1 verticalmente
        const localY = (progress - 0.5) * (stickHeight - 60);

        // Distribución en espiral helicoidal alternada
        const spiralOffset = Math.sin(i * 0.85) * (stickWidth * 0.32);
        pins.push({
          x: spiralOffset,
          y: localY,
          radius: 3.4,
          pulse: 0,
          angle: (i % 2 === 0 ? 1 : -1) * (0.35 + (i % 3) * 0.1),
          length: 22
        });
      }
    };

    const handleResize = () => {
      const parent = canvas.parentElement;
      const w = parent?.clientWidth || window.innerWidth;
      const h = parent?.clientHeight || window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      rebuildGeometry(w, h);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Inicializar 260 semillas con propiedades físicas orgánicas
    const numParticles = 260;
    const particles: Particle[] = [];
    const prof = MATERIAL_PROFILES[physicsRef.current.materialKey];

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: (Math.random() - 0.5) * (stickWidth * 0.65),
        y: (Math.random() - 0.5) * (stickHeight * 0.6),
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        radius: 2.0 + Math.random() * 2.6,
        color: Math.random() > 0.4 ? prof.colorA : prof.colorB,
        glowColor: prof.glow,
        mass: 0.8 + Math.random() * 0.6,
        trail: []
      });
    }

    // Interacción táctil directa: Agitar el palo al tocar o arrastrar sobre el canvas
    let isTouching = false;
    let lastTouchX = 0;
    let lastTouchY = 0;

    const onPointerDown = (e: PointerEvent) => {
      isTouching = true;
      lastTouchX = e.clientX;
      lastTouchY = e.clientY;

      // Impulso sísmico a las semillas al tocar
      particles.forEach((p) => {
        p.vx += (Math.random() - 0.5) * 4.5;
        p.vy += (Math.random() - 0.5) * 4.5;
      });
      triggerGrainSound(1.2, 432);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isTouching) return;
      const dx = e.clientX - lastTouchX;
      const dy = e.clientY - lastTouchY;
      lastTouchX = e.clientX;
      lastTouchY = e.clientY;

      // Inclinación por arrastre directo
      if (mode === "pointer" || !physicsRef.current.hasHardwareSensor) {
        physicsRef.current.targetAngle += dx * 0.008;
      }
    };

    const onPointerUp = () => {
      isTouching = false;
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    // ========================================================================
    // BUCLE DE RENDERIZADO Y FÍSICA A 60 FPS
    // ========================================================================
    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Suavizado del ángulo del palo (lerp hacia el objetivo)
      physicsRef.current.angle +=
        (physicsRef.current.targetAngle - physicsRef.current.angle) * 0.12;
      const currentAngle = physicsRef.current.angle;

      // Modo de Auto-Flujo Meditativo (Oscilación sinusoidal armónica)
      if (isAutoPlaying) {
        physicsRef.current.autoPhase += 0.012; // Ciclo de respiración ~9 segundos
        const autoTilt = Math.sin(physicsRef.current.autoPhase) * 0.65; // ±37 grados
        physicsRef.current.targetAngle = autoTilt;
        physicsRef.current.gx = Math.sin(autoTilt) * 1.6;
        physicsRef.current.gy = Math.cos(autoTilt) * 0.9;

        // Fases de respiración guiada
        const sinVal = Math.sin(physicsRef.current.autoPhase);
        if (sinVal > 0.4) setBreathPhase("Inhala Profundo · Llena tu pecho");
        else if (sinVal < -0.4) setBreathPhase("Exhala Lento · Suelta la tensión");
        else setBreathPhase("Sostén el Aire · Escucha la lluvia");
      }

      // 1. Fondo Místico con Gradiente Radial Profundo
      const bgGrad = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        stickWidth * 0.3,
        canvas.width / 2,
        canvas.height / 2,
        canvas.height * 0.75
      );
      bgGrad.addColorStop(0, "#231208");
      bgGrad.addColorStop(0.5, "#140A04");
      bgGrad.addColorStop(1, "#0A0402");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Dibujar Mandala Sutil de Geometría Sagrada en el Fondo
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.strokeStyle = "rgba(212, 175, 55, 0.04)";
      ctx.lineWidth = 1;
      for (let r = 80; r <= 360; r += 70) {
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      // ======================================================================
      // 2. RENDERIZADO DEL CILINDRO DEL PALO DE LLUVIA
      // ======================================================================
      ctx.save();
      ctx.translate(stickCenterX, stickCenterY);
      ctx.rotate(currentAngle);

      const halfW = stickWidth / 2;
      const halfH = stickHeight / 2;

      // Sombra exterior difusa de la madera
      ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
      ctx.shadowBlur = 45;
      ctx.shadowOffsetX = 12;
      ctx.shadowOffsetY = 16;

      // 2.1 Cuerpo Exterior de Bambú Sagrado / Cactus Pulido
      const woodGrad = ctx.createLinearGradient(-halfW, 0, halfW, 0);
      woodGrad.addColorStop(0, "#3D1E0C");
      woodGrad.addColorStop(0.2, "#73411A");
      woodGrad.addColorStop(0.48, "#A6682E");
      woodGrad.addColorStop(0.52, "#BF803D");
      woodGrad.addColorStop(0.8, "#73411A");
      woodGrad.addColorStop(1, "#3D1E0C");

      ctx.fillStyle = woodGrad;
      ctx.beginPath();
      ctx.roundRect(-halfW, -halfH, stickWidth, stickHeight, 28);
      ctx.fill();
      ctx.shadowBlur = 0; // Limpiar sombra

      // 2.2 Anillos / Nudos Naturales de Bambú (Nodes)
      const numNodes = 5;
      for (let n = 1; n < numNodes; n++) {
        const nodeY = -halfH + (stickHeight / numNodes) * n;

        // Reborde de nudo de bambú con textura oscura y anillo de latón
        ctx.strokeStyle = "rgba(20, 10, 5, 0.85)";
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(-halfW + 2, nodeY);
        ctx.lineTo(halfW - 2, nodeY);
        ctx.stroke();

        ctx.strokeStyle = "rgba(245, 215, 127, 0.4)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-halfW + 4, nodeY - 1);
        ctx.lineTo(halfW - 4, nodeY - 1);
        ctx.stroke();
      }

      // 2.3 Cavidad Interior Acústica Translúcida (Viewing Sanctuary Window)
      const innerW = stickWidth - 28;
      const innerH = stickHeight - 44;
      const innerHalfW = innerW / 2;
      const innerHalfH = innerH / 2;

      const cavityGrad = ctx.createLinearGradient(-innerHalfW, 0, innerHalfW, 0);
      cavityGrad.addColorStop(0, "rgba(18, 9, 4, 0.95)");
      cavityGrad.addColorStop(0.5, "rgba(38, 19, 8, 0.82)");
      cavityGrad.addColorStop(1, "rgba(18, 9, 4, 0.95)");

      ctx.fillStyle = cavityGrad;
      ctx.beginPath();
      ctx.roundRect(-innerHalfW, -innerHalfH, innerW, innerH, 20);
      ctx.fill();

      // Ribete interior de oro bruñido
      ctx.strokeStyle = "rgba(212, 175, 55, 0.35)";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // 2.4 Tapas Sagradas en los Extremos (Tapas con sellos solares)
      [-halfH, halfH - 18].forEach((capY) => {
        const capGrad = ctx.createLinearGradient(-halfW, 0, halfW, 0);
        capGrad.addColorStop(0, "#8C5020");
        capGrad.addColorStop(0.5, "#D4AF37");
        capGrad.addColorStop(1, "#8C5020");

        ctx.fillStyle = capGrad;
        ctx.beginPath();
        ctx.roundRect(-halfW + 4, capY, stickWidth - 8, 18, 8);
        ctx.fill();
      });

      // ======================================================================
      // 3. ESPINAS DE CACTUS / AGUJAS EN ESPIRAL (OBSTACLE PINS)
      // ======================================================================
      pins.forEach((pin) => {
        if (pin.pulse > 0) pin.pulse -= 0.04;

        // Vástago de la espina
        ctx.save();
        ctx.translate(pin.x, pin.y);
        ctx.rotate(pin.angle);

        ctx.strokeStyle =
          pin.pulse > 0 ? "rgba(245, 215, 127, 0.9)" : "rgba(194, 155, 56, 0.45)";
        ctx.lineWidth = pin.pulse > 0 ? 2.0 : 1.4;
        ctx.beginPath();
        ctx.moveTo(-pin.length / 2, 0);
        ctx.lineTo(pin.length / 2, 0);
        ctx.stroke();

        // Cabeza / punto de impacto de la espina
        ctx.fillStyle = pin.pulse > 0 ? "#FFF9E6" : "#D4AF37";
        ctx.beginPath();
        ctx.arc(0, 0, pin.radius + Math.max(pin.pulse * 2.2, 0), 0, Math.PI * 2);
        ctx.fill();

        // Resonancia expansiva cuando una semilla golpea
        if (pin.pulse > 0.3) {
          ctx.strokeStyle = `rgba(245, 215, 127, ${pin.pulse * 0.5})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(0, 0, pin.radius + (1 - pin.pulse) * 16, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      });

      // ======================================================================
      // 4. FÍSICA REALISTA DE LAS SEMILLAS (GRANULAR PARTICLES)
      // ======================================================================
      // Proyección del vector de gravedad al sistema local del palo inclinado
      const cosA = Math.cos(currentAngle);
      const sinA = Math.sin(currentAngle);
      const worldGx = physicsRef.current.gx;
      const worldGy = physicsRef.current.gy;

      // Transformación de gravedad a coordenadas relativas al cilindro
      const localGx = worldGx * cosA + worldGy * sinA;
      const localGy = -worldGx * sinA + worldGy * cosA;

      const currentProfile = MATERIAL_PROFILES[physicsRef.current.materialKey];
      let totalSpeed = 0;
      let movingCount = 0;

      particles.forEach((p) => {
        // Aplicar fuerza de gravedad local
        p.vx += localGx * 0.44 * p.mass;
        p.vy += localGy * 0.44 * p.mass;

        // Fricción del aire y superficie
        p.vx *= currentProfile.friction;
        p.vy *= currentProfile.friction;

        // Integración de posición
        p.x += p.vx;
        p.y += p.vy;

        // Límites del cilindro interior
        const minX = -innerHalfW + p.radius + 4;
        const maxX = innerHalfW - p.radius - 4;
        const minY = -innerHalfH + p.radius + 4;
        const maxY = innerHalfH - p.radius - 4;

        // Rebotes contra las paredes de bambú
        if (p.x < minX) {
          p.x = minX;
          p.vx = -p.vx * currentProfile.bounciness;
          if (Math.abs(p.vx) > 0.8) triggerGrainSound(Math.abs(p.vx));
        } else if (p.x > maxX) {
          p.x = maxX;
          p.vx = -p.vx * currentProfile.bounciness;
          if (Math.abs(p.vx) > 0.8) triggerGrainSound(Math.abs(p.vx));
        }

        if (p.y < minY) {
          p.y = minY;
          p.vy = -p.vy * currentProfile.bounciness;
          if (Math.abs(p.vy) > 0.9) triggerGrainSound(Math.abs(p.vy));
        } else if (p.y > maxY) {
          p.y = maxY;
          p.vy = -p.vy * currentProfile.bounciness;
          if (Math.abs(p.vy) > 0.9) triggerGrainSound(Math.abs(p.vy));
        }

        // Colisión con espinas internas
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
            p.vx =
              (p.vx - 1.6 * dot * nx) * currentProfile.bounciness +
              (Math.random() - 0.5) * 0.4;
            p.vy =
              (p.vy - 1.6 * dot * ny) * currentProfile.bounciness +
              (Math.random() - 0.5) * 0.4;

            pin.pulse = 1.0;
            const force = Math.hypot(p.vx, p.vy);
            if (force > 0.7) {
              triggerGrainSound(force);
            }
          }
        });

        // Dibujar semilla individual
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        const speed = Math.hypot(p.vx, p.vy);
        totalSpeed += speed;
        if (speed > 0.25) movingCount++;

        // Traza luminosa para semillas rápidas
        if (speed > 2.2) {
          ctx.strokeStyle = p.glowColor;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * 1.5, p.y - p.vy * 1.5);
          ctx.stroke();
        }
      });

      ctx.restore(); // Fin de transformación del cilindro

      // ======================================================================
      // 5. MODULACIÓN CONTINUA DEL MOTOR DE AUDIO PROCEDURAL
      // ======================================================================
      const avgSpeed = totalSpeed / numParticles;
      const intensity = Math.min(avgSpeed / 3.0, 1.0);
      setFlowIntensity(intensity);
      setActiveSpeedKm(Math.round(avgSpeed * 6.5));

      if (
        audioCtxRef.current &&
        noiseGainRef.current &&
        noiseBandpassRef.current &&
        bambooGainRef.current &&
        !isMuted
      ) {
        const audioCtx = audioCtxRef.current;
        const now = audioCtx.currentTime;

        // El volumen del manto continuo de fricción depende de cuántas semillas están en cascada
        const targetNoiseGain = Math.min(
          Math.max((movingCount / numParticles) * intensity * 0.08, 0.0001),
          0.095
        );
        noiseGainRef.current.gain.setTargetAtTime(targetNoiseGain, now, 0.08);

        // Desplazamiento dinámico de la frecuencia del filtro con la velocidad
        const baseFreq = currentProfile.bandpassFreq;
        const dynamicFreq = baseFreq + intensity * 600;
        noiseBandpassRef.current.frequency.setTargetAtTime(dynamicFreq, now, 0.1);

        // Zumbido cálido de bambú hueco
        const targetBamboo = Math.min(Math.max((intensity - 0.1) * 0.022, 0.0001), 0.024);
        bambooGainRef.current.gain.setTargetAtTime(targetBamboo, now, 0.15);
      }

      animId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [mode, isAutoPlaying, isMuted, triggerGrainSound]);

  // ============================================================================
  // RENDERIZADO DE LA INTERFAZ
  // ============================================================================
  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-screen bg-[#0A0402] text-[#F8F9FA] overflow-hidden select-none touch-none font-sans"
    >
      {/* Canvas Principal del Palo de Lluvia */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* ==================================================================== */}
      {/* GATEKEEPER MODAL INICIAL (SOSTENER Y CONECTAR) */}
      {/* ==================================================================== */}
      {!hasStarted && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative max-w-md w-full bg-gradient-to-b from-[#1C1008] via-[#140A04] to-[#0A0402] border border-amber-500/30 rounded-3xl p-6 sm:p-8 text-center shadow-[0_0_60px_rgba(212,175,55,0.25)]">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center mb-5 shadow-inner">
              <Waves className="w-8 h-8 text-amber-300 animate-pulse" />
            </div>

            <span className="inline-block text-[11px] uppercase tracking-[0.28em] text-amber-400/90 font-semibold mb-2">
              Instrumento Somático Ancestral
            </span>

            <h2 className="text-2xl sm:text-3xl font-sacred font-bold text-white mb-3">
              Palo de Lluvia Sagrado
            </h2>

            <p className="text-sm text-stone-300 font-editorial leading-relaxed mb-6">
              Sostén tu dispositivo en ambas manos. Al balancearlo suavemente, el
              acelerómetro guiará el flujo de cientos de semillas sobre espinas
              internas, generando acústica granular y resonancia de bambú en 432 Hz.
            </p>

            <button
              onClick={handleStartExperience}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 text-stone-950 font-sacred font-bold text-sm tracking-wider uppercase shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:shadow-[0_0_40px_rgba(212,175,55,0.6)] transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles size={18} />
              <span>Sostener y Conectar</span>
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-stone-400">
              <Compass size={14} className="text-amber-400" />
              <span>Compatible con Giroscopio Móvil & Mouse en PC</span>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* BARRA SUPERIOR DE ESTADO Y CONTROL */}
      {/* ==================================================================== */}
      <header className="absolute top-4 left-4 right-4 z-40 flex items-center justify-between pointer-events-none">
        {/* Chip de Sensor y Ángulo */}
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-amber-500/25 bg-[#140A04]/85 backdrop-blur-md text-xs text-amber-200 pointer-events-auto shadow-lg">
          <Compass size={15} className="text-amber-400 animate-spin-slow" />
          <span className="font-semibold tracking-wide">{sensorStatus}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping ml-1" />
        </div>

        {/* Acciones Rápidas Superior Derecha */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Botón de Invertir 180° */}
          <button
            onClick={flipRainstick}
            title="Voltear Palo 180°"
            className="px-3.5 py-2 rounded-full border border-amber-500/30 bg-[#140A04]/80 backdrop-blur-md flex items-center gap-1.5 text-xs text-amber-300 hover:text-white hover:bg-amber-500/20 transition-all cursor-pointer shadow-md"
          >
            <RotateCw size={15} />
            <span className="hidden sm:inline font-sacred">Voltear 180°</span>
          </button>

          {/* Menú de Configuración de Semillas */}
          <button
            onClick={() => setShowConfig(!showConfig)}
            title="Material de Semillas"
            className={`w-10 h-10 rounded-full border ${
              showConfig
                ? "border-amber-400 bg-amber-500/30 text-amber-200"
                : "border-white/10 bg-[#140A04]/80 text-stone-300 hover:text-white"
            } backdrop-blur-md flex items-center justify-center transition-all cursor-pointer shadow-md`}
          >
            <Sliders size={18} />
          </button>

          {/* Mute / Audio Toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            title={isMuted ? "Activar Audio" : "Silenciar"}
            className="w-10 h-10 rounded-full border border-white/10 bg-[#140A04]/80 backdrop-blur-md flex items-center justify-center text-stone-300 hover:text-white transition-all cursor-pointer shadow-md"
          >
            {isMuted ? (
              <VolumeX size={18} className="text-red-400" />
            ) : (
              <Volume2 size={18} className="text-amber-300" />
            )}
          </button>

          {/* Pantalla Completa */}
          <button
            onClick={toggleFullscreen}
            title="Pantalla Completa"
            className="hidden sm:flex w-10 h-10 rounded-full border border-white/10 bg-[#140A04]/80 backdrop-blur-md items-center justify-center text-stone-300 hover:text-white transition-all cursor-pointer shadow-md"
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
      </header>

      {/* ==================================================================== */}
      {/* PANEL FLOTANTE DE CONFIGURACIÓN DE MATERIALES Y MODOS */}
      {/* ==================================================================== */}
      {showConfig && (
        <div className="absolute top-18 right-4 z-40 w-72 sm:w-80 bg-[#140A04]/95 border border-amber-500/30 rounded-2xl p-4 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
            <span className="text-xs uppercase tracking-wider text-amber-400 font-sacred font-bold">
              Configuración Acústica
            </span>
            <span className="text-[10px] text-stone-400">432 Hz Master</span>
          </div>

          {/* Selector de Material de Semillas */}
          <div className="mb-4">
            <label className="text-[11px] uppercase tracking-wider text-stone-400 block mb-2 font-semibold">
              Material de las Semillas
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(["acacia", "cuarzo", "cafe"] as SeedMaterial[]).map((matKey) => {
                const mat = MATERIAL_PROFILES[matKey];
                const IconComponent = mat.icon;
                const isSelected = material === matKey;
                return (
                  <button
                    key={matKey}
                    onClick={() => setMaterial(matKey)}
                    className={`py-2 px-1.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      isSelected
                        ? "border-amber-400 bg-amber-500/20 text-amber-200"
                        : "border-white/10 bg-white/5 text-stone-400 hover:text-stone-200"
                    }`}
                  >
                    <IconComponent size={16} />
                    <span className="text-[10px] font-medium truncate w-full text-center">
                      {matKey === "acacia"
                        ? "Acacia"
                        : matKey === "cuarzo"
                        ? "Cuarzos"
                        : "Café"}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-stone-400 mt-2 font-editorial italic">
              {MATERIAL_PROFILES[material].description}
            </p>
          </div>

          {/* Modo de Interacción */}
          <div className="mb-4">
            <label className="text-[11px] uppercase tracking-wider text-stone-400 block mb-2 font-semibold">
              Modo de Interacción
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setInteractionMode("gyro");
                  setIsAutoPlaying(false);
                }}
                className={`py-2 px-3 rounded-xl border text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  mode === "gyro" && !isAutoPlaying
                    ? "border-amber-400 bg-amber-500/20 text-amber-200 font-semibold"
                    : "border-white/10 bg-white/5 text-stone-400 hover:text-stone-200"
                }`}
              >
                <Compass size={14} />
                <span>Giroscopio</span>
              </button>

              <button
                onClick={() => {
                  setIsAutoPlaying(!isAutoPlaying);
                }}
                className={`py-2 px-3 rounded-xl border text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  isAutoPlaying
                    ? "border-emerald-400 bg-emerald-500/20 text-emerald-200 font-semibold"
                    : "border-white/10 bg-white/5 text-stone-400 hover:text-stone-200"
                }`}
              >
                {isAutoPlaying ? <Pause size={14} /> : <Play size={14} />}
                <span>Auto-Meditación</span>
              </button>
            </div>
          </div>

          {/* Control de Volumen Maestro */}
          <div>
            <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
              <span>Volumen Resonante</span>
              <span>{Math.round(masterVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.02"
              value={masterVolume}
              onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* HUD INFERIOR: GUÍA SOMÁTICA & FRECUENCIAS */}
      {/* ==================================================================== */}
      <footer className="absolute bottom-4 left-4 right-4 z-40 pointer-events-none flex flex-col items-center gap-2 text-center">
        {/* En modo Auto-Meditación: Barra de Respiración Guiada */}
        {isAutoPlaying ? (
          <div className="pointer-events-auto inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full border border-emerald-500/30 bg-[#0E1F12]/85 backdrop-blur-lg text-xs text-emerald-200 font-sans tracking-wide shadow-xl">
            <Waves size={16} className="text-emerald-400 animate-pulse" />
            <span className="font-semibold">{breathPhase}</span>
          </div>
        ) : (
          <div className="pointer-events-auto inline-flex items-center gap-3 px-5 py-2 rounded-full border border-amber-500/25 bg-[#140A04]/85 backdrop-blur-md text-[11px] sm:text-xs text-amber-200/90 font-sans tracking-wide shadow-xl">
            <Sparkles size={14} className="text-amber-400 shrink-0" />
            <span>
              Balanza tu móvil suavemente &bull; Mueve el ratón en PC &bull; Toca para agitar
            </span>
          </div>
        )}

        {/* Indicadores de métricas en tiempo real */}
        <div className="flex items-center gap-4 text-[10px] text-stone-400 tracking-wider">
          <span>Inclinación: {tubeAngleDeg}°</span>
          <span>&bull;</span>
          <span>Flujo Semillas: {Math.round(flowIntensity * 100)}%</span>
          <span>&bull;</span>
          <span>Afinación: 432 Hz Terrenal</span>
        </div>
      </footer>
    </div>
  );
}

export default SomaticRainstick;
