"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Sparkles,
  Waves,
  Disc,
  Radio,
  Sliders,
  Compass,
  Info,
  Heart,
  Droplet,
  Wind,
  CheckCircle2,
  ChevronRight,
  Maximize2
} from "lucide-react";

export interface SolfeggioFrequency {
  hz: number;
  name: string;
  sanskritName: string;
  theme: string;
  chakra: string;
  element: string;
  description: string;
  cymaticPattern: string;
  nodalPoints: number; // Modos simétricos de onda
  primaryColor: string;
  glowColor: string;
  affirmation: string;
  biologicalImpact: string;
}

export const SOLFEGGIO_FREQUENCIES: SolfeggioFrequency[] = [
  {
    hz: 396,
    name: "Liberación de Culpa y Miedo",
    sanskritName: "Muladhara Resonance",
    theme: "Arraigo & Seguridad Fundamental",
    chakra: "Chakra Raíz",
    element: "Tierra",
    description: "Deshace los nudos del temor subconsciente y la culpa ancestral. Transforma la inseguridad en solidez terrenal.",
    cymaticPattern: "Geometría Cuadrangular de Anclaje (4 Vértices)",
    nodalPoints: 4,
    primaryColor: "#EF4444",
    glowColor: "rgba(239, 68, 68, 0.5)",
    affirmation: "Estoy a salvo, enraizado en la madre tierra y libre de todo temor.",
    biologicalImpact: "Regulación de glándulas suprarrenales y descenso del cortisol plasmático."
  },
  {
    hz: 417,
    name: "Transmutación y Cambio",
    sanskritName: "Svadhisthana Resonance",
    theme: "Desbloqueo de Traumas y Fluidez Creativa",
    chakra: "Chakra Sacro",
    element: "Agua",
    description: "Limpia memorias dolorosas del pasado y facilita procesos de renovación profunda sin resistencia.",
    cymaticPattern: "Espiral Pentagonal Líquida (5 Nodos)",
    nodalPoints: 5,
    primaryColor: "#F97316",
    glowColor: "rgba(249, 115, 22, 0.5)",
    affirmation: "Acepto el flujo constante de la vida y renazco en mi poder creador.",
    biologicalImpact: "Estimulación del sistema linfático y equilibrio en órganos reproductores."
  },
  {
    hz: 432,
    name: "Frecuencia de la Naturaleza (A=432Hz)",
    sanskritName: "Matriz Cósmica Universal",
    theme: "Geometría Sagrada & Coherencia Biológica",
    chakra: "Eje Central Cardíaco / Universal",
    element: "Éter y Biosfera",
    description: "Afinación pitagórica universal. Resuena matemáticamente con la proporción áurea (Phi) y el pulso electromagnético terrestre.",
    cymaticPattern: "Flor de la Vida Hexagonal y Dodecagonal (12 Pétalos)",
    nodalPoints: 6,
    primaryColor: "#EAB308",
    glowColor: "rgba(234, 179, 8, 0.55)",
    affirmation: "Mi biología danza en sintonía perfecta con la matemática del cosmos.",
    biologicalImpact: "Sincronización interhemisférica cerebral e inducción de ondas alfa (8-12 Hz)."
  },
  {
    hz: 528,
    name: "Frecuencia del Milagro & Reparación",
    sanskritName: "Fons Vitae (Fuente de Vida)",
    theme: "Amor Incondicional & Regeneración Celular",
    chakra: "Plexo Solar y Corazón Superior",
    element: "Luz Solar",
    description: "Célebre por su acción armonizadora sobre la estructura molecular del agua biológica y la reparación del ADN.",
    cymaticPattern: "Mandala Octogonal Radiante (8 Rayos de Luz)",
    nodalPoints: 8,
    primaryColor: "#10B981",
    glowColor: "rgba(16, 185, 129, 0.55)",
    affirmation: "El amor universal repara cada filamento de mi ser en perfecta armonía.",
    biologicalImpact: "Alineación de clusters de agua celular y estimulación de la producción de óxido nítrico."
  },
  {
    hz: 639,
    name: "Conexión e Interrelaciones",
    sanskritName: "Anahata Harmony",
    theme: "Compasión, Perdón & Lazos del Alma",
    chakra: "Chakra Corazón",
    element: "Aire",
    description: "Facilita la empatía, el perdón sincero y la disolución de barreras defensivas en las relaciones interpersonales.",
    cymaticPattern: "Roseta Toroidal Torus (6 Órbitas Entrelazadas)",
    nodalPoints: 6,
    primaryColor: "#06B6D4",
    glowColor: "rgba(6, 182, 212, 0.5)",
    affirmation: "Mi corazón emite ondas de paz que abrazan a todos los seres con amor.",
    biologicalImpact: "Aumento de la variabilidad de la frecuencia cardíaca (VFC) hacia un estado de coherencia."
  },
  {
    hz: 741,
    name: "Despertar de la Intuición",
    sanskritName: "Vishuddha Purity",
    theme: "Detox Mental & Expresión Sagrada",
    chakra: "Chakra Garganta",
    element: "Sonido Puro",
    description: "Limpia la polución electromagnética y mental. Estimula una comunicación cristalina basada en la verdad del alma.",
    cymaticPattern: "Estrella Heptagonal Dinámica (7 Vértices de Verdad)",
    nodalPoints: 7,
    primaryColor: "#3B82F6",
    glowColor: "rgba(59, 130, 246, 0.5)",
    affirmation: "Expreso mi autenticidad con pureza, serenidad y convicción impecable.",
    biologicalImpact: "Descongestión de las vías respiratorias superiores y relajación laríngea."
  },
  {
    hz: 852,
    name: "Retorno al Orden Espiritual",
    sanskritName: "Ajna Claritas",
    theme: "Visión Interior & Tercer Ojo",
    chakra: "Chakra Tercer Ojo",
    element: "Luz Mental",
    description: "Eleva la percepción más allá del velo de la ilusión terrenal. Abre la clarividencia espiritual y la serenidad profunda.",
    cymaticPattern: "Caleidoscopio Eneagonal Sagrado (9 Nodos Radiantes)",
    nodalPoints: 9,
    primaryColor: "#8B5CF6",
    glowColor: "rgba(139, 92, 246, 0.55)",
    affirmation: "Veo con claridad a través de los ojos de mi ser eterno.",
    biologicalImpact: "Estimulación de la glándula pineal y modulación de la secreción de melatonina."
  },
  {
    hz: 963,
    name: "Conciencia Cósmica y Corona",
    sanskritName: "Sahasrara Lux",
    theme: "Unidad con la Fuente & Estado de Gracia",
    chakra: "Chakra Corona",
    element: "Conciencia Pura",
    description: "Reconexión directa con la Conciencia Universal primordial. Estado de iluminación, vacuidad fértil y beatitud.",
    cymaticPattern: "Corona de Luz Dodecagonal Fina (12-24 Pétalos Cósmicos)",
    nodalPoints: 12,
    primaryColor: "#D946EF",
    glowColor: "rgba(217, 70, 239, 0.6)",
    affirmation: "Yo soy uno con la Mente Universal. La luz divina habita en mí.",
    biologicalImpact: "Facilitación de estados meditativos profundos con dominancia de ondas Theta y Gamma."
  }
];

export function SolfeggioCymaticsTuner() {
  const [selectedFreq, setSelectedFreq] = useState<SolfeggioFrequency>(SOLFEGGIO_FREQUENCIES[2]); // 432 Hz default
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.5);
  const [enableBinaural, setEnableBinaural] = useState<boolean>(false);
  const [enableWaterAmbience, setEnableWaterAmbience] = useState<boolean>(true);
  const [breathingPhase, setBreathingPhase] = useState<string>("Inhala");
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscMainRef = useRef<OscillatorNode | null>(null);
  const oscHarmonicRef = useRef<OscillatorNode | null>(null);
  const oscBinauralRef = useRef<OscillatorNode | null>(null);
  const gainMasterRef = useRef<GainNode | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);

  // Ciclo de Respiración Somática (4s Inhala, 4s Retén, 6s Exhala, 2s Reposo)
  useEffect(() => {
    let timer: any;
    let phaseIdx = 0;
    const phases = [
      { label: "Inhala", duration: 4000 },
      { label: "Sostén", duration: 3500 },
      { label: "Exhala", duration: 5500 },
      { label: "Vacío Sereno", duration: 2500 }
    ];

    const runCycle = () => {
      setBreathingPhase(phases[phaseIdx].label);
      timer = setTimeout(() => {
        phaseIdx = (phaseIdx + 1) % phases.length;
        runCycle();
      }, phases[phaseIdx].duration);
    };

    runCycle();
    return () => clearTimeout(timer);
  }, []);

  // Web Audio API Synthesizer
  const stopAudio = () => {
    try {
      if (gainMasterRef.current && audioCtxRef.current) {
        gainMasterRef.current.gain.linearRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 0.5);
      }
      setTimeout(() => {
        if (oscMainRef.current) {
          oscMainRef.current.stop();
          oscMainRef.current.disconnect();
          oscMainRef.current = null;
        }
        if (oscHarmonicRef.current) {
          oscHarmonicRef.current.stop();
          oscHarmonicRef.current.disconnect();
          oscHarmonicRef.current = null;
        }
        if (oscBinauralRef.current) {
          oscBinauralRef.current.stop();
          oscBinauralRef.current.disconnect();
          oscBinauralRef.current = null;
        }
        if (noiseNodeRef.current) {
          noiseNodeRef.current.disconnect();
          noiseNodeRef.current = null;
        }
      }, 550);
    } catch (e) {
      console.warn(e);
    }
    setIsPlaying(false);
  };

  const startAudio = (freq: SolfeggioFrequency) => {
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtxClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      // Detener nodos previos si existen
      if (oscMainRef.current) {
        oscMainRef.current.stop();
        oscMainRef.current.disconnect();
      }
      if (oscHarmonicRef.current) {
        oscHarmonicRef.current.stop();
        oscHarmonicRef.current.disconnect();
      }
      if (oscBinauralRef.current) {
        oscBinauralRef.current.stop();
        oscBinauralRef.current.disconnect();
      }

      // Master Gain
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(Math.max(volume * 0.15, 0.005), ctx.currentTime + 1.2);
      masterGain.connect(ctx.destination);
      gainMasterRef.current = masterGain;

      // Oscilador Principal (Onda Pura Senoidal)
      const oscMain = ctx.createOscillator();
      oscMain.type = "sine";
      oscMain.frequency.setValueAtTime(freq.hz, ctx.currentTime);

      const mainGain = ctx.createGain();
      mainGain.gain.setValueAtTime(0.7, ctx.currentTime);
      oscMain.connect(mainGain);
      mainGain.connect(masterGain);
      oscMain.start();
      oscMainRef.current = oscMain;

      // Oscilador Armónico Suave (Octava / Armónico cálido a -16dB)
      const oscHarmonic = ctx.createOscillator();
      oscHarmonic.type = "triangle";
      oscHarmonic.frequency.setValueAtTime(freq.hz * 1.5, ctx.currentTime); // Quinta justa armónica

      const harmGain = ctx.createGain();
      harmGain.gain.setValueAtTime(0.08, ctx.currentTime);
      oscHarmonic.connect(harmGain);
      harmGain.connect(masterGain);
      oscHarmonic.start();
      oscHarmonicRef.current = oscHarmonic;

      // Puerro Binaural (+7.83 Hz Resonancia Schumann / Theta)
      if (enableBinaural) {
        const oscBinaural = ctx.createOscillator();
        oscBinaural.type = "sine";
        oscBinaural.frequency.setValueAtTime(freq.hz + 7.83, ctx.currentTime);

        const binGain = ctx.createGain();
        binGain.gain.setValueAtTime(0.25, ctx.currentTime);
        oscBinaural.connect(binGain);
        binGain.connect(masterGain);
        oscBinaural.start();
        oscBinauralRef.current = oscBinaural;
      }

      // Generador de Ruido Rosa Suave (Ambiente de Arroyo / Cascada de Templo)
      if (enableWaterAmbience) {
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          data[i] = (b0 + b1 + b2) * 0.05;
        }

        const noiseSource = ctx.createBufferSource();
        noiseSource.buffer = buffer;
        noiseSource.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(480, ctx.currentTime);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.04, ctx.currentTime);

        noiseSource.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(masterGain);
        noiseSource.start();
        noiseNodeRef.current = noiseSource;
      }

      setIsPlaying(true);
    } catch (err) {
      console.error("Synthesizer error:", err);
    }
  };

  const togglePlayback = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      startAudio(selectedFreq);
    }
  };

  const handleSelectFrequency = (freq: SolfeggioFrequency) => {
    setSelectedFreq(freq);
    if (isPlaying) {
      startAudio(freq);
    }
  };

  // Ajuste de Volumen en Vivo
  useEffect(() => {
    if (gainMasterRef.current && audioCtxRef.current && isPlaying) {
      gainMasterRef.current.gain.linearRampToValueAtTime(
        Math.max(volume * 0.15, 0.002),
        audioCtxRef.current.currentTime + 0.1
      );
    }
  }, [volume]);

  // Click / Touch en el Estanque de Agua Cimática (Soporte táctil y cursor)
  const handleCanvasPointer = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRipples((prev) => [...prev.slice(-8), { x, y, id: Date.now() }]);
  };

  // Motor Visualizador Cimático en Canvas (Patrones de Chladni & Ondas de Faraday en Agua)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let t = 0;

    // Generar partículas suspendidas en agua
    const numParticles = 480;
    const particles = Array.from({ length: numParticles }, () => {
      const radius = 10 + Math.random() * 240;
      const angle = Math.random() * Math.PI * 2;
      return {
        r: radius,
        baseR: radius,
        angle: angle,
        speed: 0.002 + Math.random() * 0.004,
        size: 0.8 + Math.random() * 1.8,
        alpha: 0.2 + Math.random() * 0.6
      };
    });

    const render = () => {
      t += 0.025;
      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;
      const maxRadius = Math.min(cx, cy) - 20;

      // Fondo del estanque obsidiana / agua profunda
      ctx.fillStyle = "#040711";
      ctx.fillRect(0, 0, width, height);

      // Borde y Halo Exterior del Recipiente Sagrado
      const bowlGradient = ctx.createRadialGradient(cx, cy, maxRadius * 0.8, cx, cy, maxRadius + 15);
      bowlGradient.addColorStop(0, "rgba(10, 15, 30, 0.95)");
      bowlGradient.addColorStop(0.9, "rgba(212, 175, 55, 0.35)");
      bowlGradient.addColorStop(1, "rgba(245, 215, 127, 0.85)");

      ctx.beginPath();
      ctx.arc(cx, cy, maxRadius + 4, 0, Math.PI * 2);
      ctx.strokeStyle = bowlGradient;
      ctx.lineWidth = 4;
      ctx.stroke();

      // Agua Iluminada con Cáustica Suave
      const waterGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxRadius);
      waterGrad.addColorStop(0, selectedFreq.glowColor);
      waterGrad.addColorStop(0.4, "rgba(14, 165, 233, 0.18)");
      waterGrad.addColorStop(0.85, "rgba(15, 23, 42, 0.85)");
      waterGrad.addColorStop(1, "rgba(4, 7, 17, 0.98)");

      ctx.beginPath();
      ctx.arc(cx, cy, maxRadius, 0, Math.PI * 2);
      ctx.fillStyle = waterGrad;
      ctx.fill();

      // Ondas Concéntricas del Estanque
      const activeAmplitude = isPlaying ? 1.0 : 0.25;
      const m = selectedFreq.nodalPoints; // Simetría angular del patrón cimático
      const waveFreq = (selectedFreq.hz / 100) * 0.8;

      ctx.save();
      ctx.translate(cx, cy);

      // Dibujar Rosetas y Patrones Nodal Cimático (Función de Chladni en Coordenadas Polares)
      const numRings = 7;
      for (let ring = 1; ring <= numRings; ring++) {
        const ringRadius = (maxRadius / (numRings + 1)) * ring;
        ctx.beginPath();
        const steps = 180;
        for (let i = 0; i <= steps; i++) {
          const theta = (i / steps) * Math.PI * 2;
          // Ecuación de modulación cimática
          const cymaticModulation = Math.cos(m * theta) * Math.sin(ring * waveFreq - t * 1.5) * (12 * activeAmplitude);
          const r = ringRadius + cymaticModulation;
          const px = r * Math.cos(theta);
          const py = r * Math.sin(theta);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.strokeStyle = `rgba(245, 215, 127, ${0.12 + (ring / numRings) * 0.25 * activeAmplitude})`;
        ctx.lineWidth = ring % 2 === 0 ? 1.5 : 0.8;
        ctx.stroke();
      }

      // Dibujar Rayos Nodal / Geometría Sagrada Luminiscente
      for (let k = 0; k < m * 2; k++) {
        const angle = (k / (m * 2)) * Math.PI * 2 + t * 0.05;
        const lineLen = maxRadius * (0.85 + Math.sin(t * 2 + k) * 0.08 * activeAmplitude);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(angle) * lineLen, Math.sin(angle) * lineLen);
        ctx.strokeStyle = k % 2 === 0 ? selectedFreq.glowColor : "rgba(255, 255, 255, 0.15)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Partículas Flotantes (Polvo de Oro acumulado en las Líneas Nodales)
      particles.forEach((p) => {
        p.angle += p.speed;
        // La oscilación empuja las partículas hacia los nodos de reposo
        const nodalAttractor = Math.sin(m * p.angle);
        const dynamicR = p.baseR + nodalAttractor * 18 * activeAmplitude * Math.sin(t);
        const px = Math.cos(p.angle) * dynamicR;
        const py = Math.sin(p.angle) * dynamicR;

        ctx.beginPath();
        ctx.arc(px, py, p.size * (isPlaying ? 1.3 : 1), 0, Math.PI * 2);
        ctx.fillStyle = isPlaying ? "#FDE68A" : "rgba(245, 215, 127, 0.5)";
        ctx.shadowColor = selectedFreq.primaryColor;
        ctx.shadowBlur = isPlaying ? 6 : 0;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Ondulaciones por Interacción (Ripples)
      ripples.forEach((rp, idx) => {
        const age = (Date.now() - rp.id) / 1000;
        if (age < 2.5) {
          const ripRadius = age * 90;
          const ripAlpha = Math.max(0, 1 - age / 2.5);
          ctx.beginPath();
          ctx.arc(rp.x - cx, rp.y - cy, ripRadius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 255, 255, ${ripAlpha * 0.6})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });

      // Centro Radiante (Punto Bindu / Manantial Central)
      const centerPulse = Math.sin(t * 3) * 6 * activeAmplitude;
      const centerGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 35 + centerPulse);
      centerGrad.addColorStop(0, "#FFFFFF");
      centerGrad.addColorStop(0.3, selectedFreq.primaryColor);
      centerGrad.addColorStop(1, "transparent");

      ctx.beginPath();
      ctx.arc(0, 0, 30 + centerPulse, 0, Math.PI * 2);
      ctx.fillStyle = centerGrad;
      ctx.fill();

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [selectedFreq, isPlaying, ripples]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-12">
      {/* Título de la Experiencia */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-sky-400/30 bg-sky-500/10 text-sky-300 text-xs tracking-widest uppercase font-semibold">
          <Waves size={14} className="animate-pulse" />
          <span>Sintonizador de Frecuencias Solfeggio & Cimática</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-sacred font-bold text-white tracking-wide">
          Armonización en Agua Iluminada
        </h2>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
          El sonido es geometría visible en el agua. Sintoniza las frecuencias sagradas para observar
          cómo vibran los patrones de Chladni sobre el estanque etérico y alinear tu campo celular.
        </p>
      </div>

      {/* Grid Central: Estanque Cimático + Controles y Resonancia */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Columna Izquierda / Central: Visualizador Cimático */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="relative w-full aspect-square max-w-[560px] rounded-3xl p-3 border border-white/10 bg-gradient-to-b from-[#0e1628]/80 to-[#040711]/90 shadow-[0_0_50px_rgba(14,165,233,0.15)] backdrop-blur-2xl flex items-center justify-center">
            {/* Halo Exterior Dinámico con el Color de la Frecuencia */}
            <div
              className="absolute inset-0 rounded-3xl blur-3xl opacity-30 transition-all duration-1000 -z-10"
              style={{ backgroundColor: selectedFreq.primaryColor }}
            />

            {/* Canvas Interactivo */}
            <canvas
              ref={canvasRef}
              width={520}
              height={520}
              onPointerDown={handleCanvasPointer}
              className="w-full h-full rounded-2xl cursor-pointer shadow-inner touch-none"
              title="Toca o haz clic sobre el agua para crear ondas"
            />

            {/* Pauta Somática de Respiración Flotante */}
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between px-4 py-2.5 rounded-2xl border border-white/10 bg-[#090A10]/75 backdrop-blur-md text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <Wind size={16} className="text-sky-400 animate-pulse" />
                <span className="text-slate-400">Pauta de Respiración:</span>
                <span className="font-semibold text-amber-300 tracking-wider uppercase">
                  {breathingPhase}
                </span>
              </div>
              <span className="text-[11px] text-slate-500 hidden sm:inline">
                Toca el agua para perturbar el campo
              </span>
            </div>
          </div>

          {/* Consola de Control de Audio */}
          <div className="w-full max-w-[560px] mt-6 p-5 rounded-2xl border border-white/10 bg-[#131422]/70 backdrop-blur-xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlayback}
                className="w-14 h-14 rounded-full flex items-center justify-center font-bold transition-all shadow-[0_0_25px_rgba(212,175,55,0.4)]"
                style={{
                  background: isPlaying
                    ? "linear-gradient(135deg, #10B981 0%, #059669 100%)"
                    : "linear-gradient(135deg, #D4AF37 0%, #F5D77F 100%)",
                  color: "#040508"
                }}
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-white font-sacred">
                    {selectedFreq.hz} Hz
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full border border-white/10 text-slate-300 bg-white/5">
                    {selectedFreq.chakra}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-sans">
                  {isPlaying ? "Vibración Activa resonando..." : "Presiona reproducir para iniciar"}
                </p>
              </div>
            </div>

            {/* Slider de Volumen y Toggles */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Volume2 size={16} className="text-slate-400" />
                <input
                  type="range"
                  min="0.05"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-20 sm:w-28 accent-amber-400 cursor-pointer"
                />
              </div>

              <button
                onClick={() => setEnableBinaural(!enableBinaural)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                  enableBinaural
                    ? "border-purple-400 bg-purple-500/20 text-purple-200"
                    : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
                }`}
                title="Añade pulso binaural Theta (+7.83Hz Schumann)"
              >
                Binaural 7.83Hz
              </button>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Frecuencias Solfeggio & Guía Somática */}
        <div className="lg:col-span-5 space-y-6">
          {/* Selector de Frecuencias */}
          <div className="p-6 rounded-3xl border border-white/10 bg-[#0e1628]/60 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-sacred font-bold text-white flex items-center gap-2">
                <Disc size={18} className="text-amber-300" />
                Escala de Frecuencias Solfeggio
              </h3>
              <span className="text-xs text-slate-400 font-mono">8 Afinaciones</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
              {SOLFEGGIO_FREQUENCIES.map((freq) => {
                const isCurrent = selectedFreq.hz === freq.hz;
                return (
                  <button
                    key={freq.hz}
                    onClick={() => handleSelectFrequency(freq)}
                    className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                      isCurrent
                        ? "border-amber-400/80 bg-amber-400/15 shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                        : "border-white/5 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className="text-base font-bold font-sacred"
                        style={{ color: isCurrent ? "#F5D77F" : "#FFFFFF" }}
                      >
                        {freq.hz} Hz
                      </span>
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: freq.primaryColor }}
                      />
                    </div>
                    <p className="text-xs text-slate-300 font-medium line-clamp-1">
                      {freq.name}
                    </p>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {freq.chakra}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tarjeta de Información Detallada de la Frecuencia Seleccionada */}
          <div className="p-6 sm:p-7 rounded-3xl border border-white/10 bg-gradient-to-b from-[#131422]/80 to-[#090A10]/95 backdrop-blur-2xl shadow-xl space-y-6">
            <div className="flex items-start justify-between border-b border-white/[0.08] pb-4">
              <div>
                <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: selectedFreq.primaryColor }}>
                  {selectedFreq.sanskritName}
                </span>
                <h4 className="text-2xl font-sacred font-bold text-white mt-1">
                  {selectedFreq.hz} Hz · {selectedFreq.name}
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  {selectedFreq.theme} · Elemento {selectedFreq.element}
                </p>
              </div>

              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-lg"
                style={{
                  backgroundColor: selectedFreq.primaryColor,
                  boxShadow: `0 0 25px ${selectedFreq.glowColor}`
                }}
              >
                <Waves size={24} />
              </div>
            </div>

            {/* Descripción y Patrón Cimático */}
            <div className="space-y-4 text-sm text-slate-300">
              <p className="leading-relaxed">
                {selectedFreq.description}
              </p>

              <div className="p-3.5 rounded-2xl border border-white/10 bg-white/[0.03] space-y-1">
                <div className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                  <Sparkles size={14} className="text-amber-300" />
                  <span>Patrón Geométrico Cimático:</span>
                </div>
                <p className="text-sm font-semibold text-amber-200">
                  {selectedFreq.cymaticPattern}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 space-y-1">
                <div className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
                  <Heart size={14} />
                  <span>Impacto Biológico Celular:</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300">
                  {selectedFreq.biologicalImpact}
                </p>
              </div>
            </div>

            {/* Decreto / Afirmación de Anclaje */}
            <div className="p-4 rounded-2xl border border-amber-400/25 bg-amber-400/5 text-center">
              <span className="text-[11px] uppercase tracking-widest text-amber-400 font-semibold block mb-1">
                Afirmación de Resonancia
              </span>
              <p className="text-sm sm:text-base font-editorial italic text-slate-100">
                "{selectedFreq.affirmation}"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SolfeggioCymaticsTuner;
