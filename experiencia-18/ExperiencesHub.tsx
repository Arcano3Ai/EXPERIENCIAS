"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Disc,
  Droplets,
  Radio,
  Flame,
  Moon,
  Eye,
  BookOpen,
  Compass,
  Activity,
  Layers,
  Wind,
  ShieldCheck,
  Search,
  ArrowRight,
  ArrowLeft,
  X,
  Lock,
  CheckCircle2,
  Maximize2
} from "lucide-react";

// Importar Experiencias Listas
import { TibetanBowlsSanctuary } from "./TibetanBowlsSanctuary";
import { SomaticRainstick } from "../experiencia-19/SomaticRainstick";
import { ChakraEnergyMap } from "../experiencia-02/ChakraEnergyMap";
import { SolfeggioCymaticsTuner } from "../experiencia-03/SolfeggioCymaticsTuner";
import ArchangelApp from "../experiencia-01/App";

export interface ExperienceDef {
  num: number;
  id: string;
  title: string;
  subtitle: string;
  category: "sonido" | "energia" | "oraculo";
  categoryLabel: string;
  colorHex: string;
  glowHex: string;
  icon: string;
  status: "active" | "preview";
  description: string;
  keyFeature: string;
}

export const EXPERIENCES_LIST: ExperienceDef[] = [
  {
    num: 1,
    id: "exp-01",
    title: "Portal de los 7 Arcángeles",
    subtitle: "Invocación Celestial & Rayos Sagrados",
    category: "energia",
    categoryLabel: "Chakras & Energía",
    colorHex: "#3B82F6",
    glowHex: "rgba(59, 130, 246, 0.4)",
    icon: "Shield",
    status: "active",
    description: "Conexión directa con los 7 Arcángeles (Miguel, Rafael, Gabriel, Uriel, Chamuel, Jofiel, Zadkiel), decretos de poder y sintonía en 528 Hz.",
    keyFeature: "Canalización guiada, sellos angelicales y decretos de blindaje."
  },
  {
    num: 2,
    id: "exp-02",
    title: "Mapa Interactivo de Chakras",
    subtitle: "Alineación del Campo Áurico",
    category: "energia",
    categoryLabel: "Chakras & Energía",
    colorHex: "#8B5CF6",
    glowHex: "rgba(139, 92, 246, 0.4)",
    icon: "Activity",
    status: "active",
    description: "Explora la silueta energética del cuerpo humano. Diagnóstico de balance, frecuencias específicas en Hz y prescripción terapéutica holística.",
    keyFeature: "Silueta SVG táctil, síntomas de bloqueo y afirmaciones de poder."
  },
  {
    num: 3,
    id: "exp-03",
    title: "Sintonizador Solfeggio Cimático",
    subtitle: "Patrones de Chladni en Agua Iluminada",
    category: "sonido",
    categoryLabel: "Sonido & Acústica",
    colorHex: "#0EA5E9",
    glowHex: "rgba(14, 165, 233, 0.4)",
    icon: "Waves",
    status: "active",
    description: "Visualizador cimático en Canvas con agua reactiva que forma geometría sagrada pura según la frecuencia Solfeggio seleccionada (432 Hz, 528 Hz...).",
    keyFeature: "Ondas de Faraday líquidas, pauta de respiración y pulsos binaurales."
  },
  {
    num: 4,
    id: "exp-04",
    title: "Rueda de los 4 Arquetipos Femeninos",
    subtitle: "Mandala Biocíclico & Sabiduría Lunar",
    category: "energia",
    categoryLabel: "Chakras & Energía",
    colorHex: "#EC4899",
    glowHex: "rgba(236, 72, 153, 0.4)",
    icon: "Moon",
    status: "preview",
    description: "Navegación interactiva por los cuatro arquetipos: Doncella, Madre, Hechicera y Anciana, enlazados con las fases lunares y guías botánicas.",
    keyFeature: "Mandala cíclico somático, aceites esenciales y diario lunar."
  },
  {
    num: 5,
    id: "exp-05",
    title: "Altar Virtual de Sahumado",
    subtitle: "Ritual de Limpieza Energética",
    category: "energia",
    categoryLabel: "Chakras & Energía",
    colorHex: "#F97316",
    glowHex: "rgba(249, 115, 22, 0.4)",
    icon: "Flame",
    status: "preview",
    description: "Sahumador artesanal con física de humo volumétrico y selección de hierbas sagradas: Copal, Palo Santo, Salvia Blanca y Ruda para limpiar el aura.",
    keyFeature: "Simulación de brasas, oraciones de purificación y humo interactivo."
  },
  {
    num: 6,
    id: "exp-06",
    title: "Santuario de Velación",
    subtitle: "Consagración del Fuego Sagrado",
    category: "energia",
    categoryLabel: "Chakras & Energía",
    colorHex: "#EAB308",
    glowHex: "rgba(234, 179, 8, 0.4)",
    icon: "Flame",
    status: "preview",
    description: "Encendido virtual de velas con flama hiperrealista en Canvas. Selección de rayo cromático, consagración de decretos y ofrendas de intención.",
    keyFeature: "Flama viva con física de aire, pergamino de intenciones y sellado."
  },
  {
    num: 7,
    id: "exp-07",
    title: "Oráculo del Cubo de Metatrón",
    subtitle: "Geometría Sagrada & Sólidos Platónicos",
    category: "oraculo",
    categoryLabel: "Oráculos & Geometría",
    colorHex: "#A855F7",
    glowHex: "rgba(168, 85, 247, 0.4)",
    icon: "Compass",
    status: "preview",
    description: "Proyección geométrica interactiva de los 5 sólidos platónicos y activación de los 13 nodos celestes para consultas oraculares profundas.",
    keyFeature: "Geometría multidimensional, tirada oracular y códigos de luz."
  },
  {
    num: 8,
    id: "exp-08",
    title: "Acceso a los Registros Akáshicos",
    subtitle: "Biblioteca Cuántica del Alma",
    category: "oraculo",
    categoryLabel: "Oráculos & Geometría",
    colorHex: "#6366F1",
    glowHex: "rgba(99, 102, 241, 0.4)",
    icon: "BookOpen",
    status: "preview",
    description: "Templo etérico de introspección espiritual. Apertura mediante la Oración del Sendero y canalización guiada para explorar la misión del alma.",
    keyFeature: "Rito sagrado de apertura, consultas de propósito y libro etérico."
  },
  {
    num: 9,
    id: "exp-09",
    title: "Péndulo Radiestésico de Cuarzo",
    subtitle: "Calibración & Respuestas del Yo Superior",
    category: "oraculo",
    categoryLabel: "Oráculos & Geometría",
    colorHex: "#14B8A6",
    glowHex: "rgba(20, 184, 166, 0.4)",
    icon: "Compass",
    status: "preview",
    description: "Simulación física de péndulo de cuarzo con oscilación armónica para calibración de respuestas sí/no y lectura de biométrico de Bovis.",
    keyFeature: "Física de péndulo en gravedad real, gráficos de calibración áurica."
  },
  {
    num: 10,
    id: "exp-10",
    title: "Tarot de los Arcanos Mayores",
    subtitle: "Tirada Terapéutica de Espejos Cósmicos",
    category: "oraculo",
    categoryLabel: "Oráculos & Geometría",
    colorHex: "#D946EF",
    glowHex: "rgba(217, 70, 239, 0.4)",
    icon: "Layers",
    status: "preview",
    description: "Mazo oracular interactivo de los 22 Arcanos Mayores con barajado 3D, tirada de la Cruz Céltica y revelación del camino iniciático.",
    keyFeature: "Animación de cartas con texturas doradas y canalización terapéutica."
  },
  {
    num: 11,
    id: "exp-11",
    title: "Geometría de la Flor de la Vida",
    subtitle: "Matriz Fractal de Proporción Áurea",
    category: "oraculo",
    categoryLabel: "Oráculos & Geometría",
    colorHex: "#F59E0B",
    glowHex: "rgba(245, 158, 11, 0.4)",
    icon: "Sparkles",
    status: "preview",
    description: "Generador dinámico de mandalas fractales basados en la proporción áurea (Phi), la Semilla de la Vida y la Vesica Piscis.",
    keyFeature: "Control paramétrico de simetría, animación de espirales de Fibonacci."
  },
  {
    num: 12,
    id: "exp-12",
    title: "Jardín Zen de Arena y Piedras",
    subtitle: "Rastrillado Contemplativo Taoísta",
    category: "energia",
    categoryLabel: "Chakras & Energía",
    colorHex: "#84CC16",
    glowHex: "rgba(132, 204, 22, 0.4)",
    icon: "Droplets",
    status: "preview",
    description: "Karesansui digital. Rastrilla patrones sobre arena sagrada, acomoda piedras de cuarzo y escucha el flujo de la serenidad mental.",
    keyFeature: "Textura de arena reactiva al trazo táctil, relajación profunda."
  },
  {
    num: 13,
    id: "exp-13",
    title: "Laboratorio de Elixires y Cristales",
    subtitle: "Activación de Gemas Cuánticas",
    category: "energia",
    categoryLabel: "Chakras & Energía",
    colorHex: "#06B6D4",
    glowHex: "rgba(6, 182, 212, 0.4)",
    icon: "Sparkles",
    status: "preview",
    description: "Alquimia mineral con amatista, selenita, cuarzo rosa y obsidiana. Aprende a crear elixires solares y lunares para armonizar el agua.",
    keyFeature: "Enciclopedia gemológica interactiva, activación con luz y sonido."
  },
  {
    num: 14,
    id: "exp-14",
    title: "Carta Astral y Matriz Estelar",
    subtitle: "Mapa Cósmico del Nacimiento",
    category: "oraculo",
    categoryLabel: "Oráculos & Geometría",
    colorHex: "#8B5CF6",
    glowHex: "rgba(139, 92, 246, 0.4)",
    icon: "Compass",
    status: "preview",
    description: "Visualizador tridimensional de constelaciones zodiacales, casas astrológicas y alineación de planetas natales con la bóveda celeste.",
    keyFeature: "Rueda zodiacal interactiva, aspectos planetarios y tránsitos."
  },
  {
    num: 15,
    id: "exp-15",
    title: "Meditación de Respiración Pránica",
    subtitle: "Pacer de Coherencia Cardíaca 5.5s",
    category: "energia",
    categoryLabel: "Chakras & Energía",
    colorHex: "#10B981",
    glowHex: "rgba(16, 185, 129, 0.4)",
    icon: "Wind",
    status: "preview",
    description: "Guía somática con pacer geométrico esférico que expande y contrae la respiración en ciclos de coherencia cardíaca para calmar el sistema nervioso.",
    keyFeature: "Sincronizador visual de pulso, campana de transición y biofeedback."
  },
  {
    num: 16,
    id: "exp-16",
    title: "Laberinto Sagrado de Meditación",
    subtitle: "Caminata Contemplativa al Centro del Ser",
    category: "energia",
    categoryLabel: "Chakras & Energía",
    colorHex: "#D97706",
    glowHex: "rgba(217, 119, 6, 0.4)",
    icon: "Compass",
    status: "preview",
    description: "Laberinto unicursal de Chartres. Recorre con tu dedo o cursor el sendero iniciático de desapego, recepción e integración.",
    keyFeature: "Música de arpa celta, caminata meditativa guiada y reflexión."
  },
  {
    num: 17,
    id: "exp-17",
    title: "Campanas Koshi Elementales",
    subtitle: "Acústica de los 4 Elementos",
    category: "sonido",
    categoryLabel: "Sonido & Acústica",
    colorHex: "#38BDF8",
    glowHex: "rgba(56, 189, 248, 0.4)",
    icon: "Wind",
    status: "preview",
    description: "Cuatro campanas de bambú afinadas a los elementos: Terra (G C E F G C E G), Aqua, Aria e Ignis. Suenan suavemente con la brisa virtual.",
    keyFeature: "Física de badajo oscilante, sonido de viento de montaña y madera."
  },
  {
    num: 18,
    id: "exp-18",
    title: "Santuario de Cuencos Tibetanos",
    subtitle: "Resonancia de 7 Metales Sagrados",
    category: "sonido",
    categoryLabel: "Sonido & Acústica",
    colorHex: "#CD7F32",
    glowHex: "rgba(205, 127, 50, 0.4)",
    icon: "Disc",
    status: "active",
    description: "Santuario de cuencos forjados a mano afinados en notas fundamentales y chakras. Incluye golpe afelpado de mazo, borde cantado y baño sonoro.",
    keyFeature: "Batimiento binaural acústico (wa-wa-wa), ondas de Faraday en agua."
  },
  {
    num: 19,
    id: "exp-19",
    title: "Palo de Lluvia Somático",
    subtitle: "Instrumento Táctil por Balanceo Móvil",
    category: "sonido",
    categoryLabel: "Sonido & Acústica",
    colorHex: "#A06B33",
    glowHex: "rgba(160, 107, 51, 0.4)",
    icon: "Droplets",
    status: "active",
    description: "Convierte el teléfono en un palo de lluvia ancestral. Al balancear el móvil de lado a lado, las 160 semillas caen con gravedad física y sonido zen.",
    keyFeature: "Giroscopio nativo a 60 FPS, acústica pura de bambú zen sin estridencia."
  },
  {
    num: 20,
    id: "exp-20",
    title: "Espejo de Obsidiana",
    subtitle: "Oráculo Tolteca de la Mirada Interior",
    category: "oraculo",
    categoryLabel: "Oráculos & Geometría",
    colorHex: "#996515",
    glowHex: "rgba(153, 101, 21, 0.4)",
    icon: "Eye",
    status: "active",
    description: "Antiguo espejo de Tezcatlipoca con marco labrado en oro y velas votivas parpadeantes. Mirar el reflejo oscuro disuelve las máscaras del ego.",
    keyFeature: "Oráculo de humo negro, confrontación de sombra y transmutación."
  }
];

export function ExperiencesHub() {
  const [selectedExpId, setSelectedExpId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("todos");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [previewModalExp, setPreviewModalExp] = useState<ExperienceDef | null>(null);

  // Filtrado de Experiencias
  const filteredExperiences = EXPERIENCES_LIST.filter((exp) => {
    const matchesCategory =
      filterCategory === "todos" || exp.category === filterCategory;
    const matchesQuery =
      exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.num.toString().includes(searchQuery);
    return matchesCategory && matchesQuery;
  });

  const activeExp = EXPERIENCES_LIST.find((e) => e.id === selectedExpId);

  const handleLaunchExperience = (expId: string) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const temp = new AudioCtx();
        if (temp.state === "suspended") temp.resume().catch(() => {});
      }
    } catch (e) {}
    setSelectedExpId(expId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Renderizar la experiencia activa
  if (activeExp && activeExp.status === "active") {
    return (
      <div className="relative min-h-screen bg-[#0A0704] text-[#F8F9FA]">
        {/* Barra Flotante de Retorno */}
        <header className="sticky top-0 z-50 w-full px-3 sm:px-6 py-2.5 sm:py-3 bg-[#140D07]/95 backdrop-blur-xl border-b border-amber-500/20 flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => {
                setSelectedExpId(null);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-amber-400/40 bg-gradient-to-r from-amber-600/30 to-amber-700/30 text-amber-200 hover:border-amber-400 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer text-xs sm:text-sm font-semibold shadow-md shrink-0"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Volver al Catálogo (20)</span>
              <span className="sm:hidden">Catálogo (20)</span>
            </button>

            <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-stone-300 truncate">
              <span className="font-mono text-amber-400 shrink-0">EXP {String(activeExp.num).padStart(2, "0")}</span>
              <span className="hidden xs:inline">·</span>
              <span className="font-sacred font-bold text-white truncate">{activeExp.title}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-amber-300 border border-amber-400/25 bg-amber-400/10 px-2.5 sm:px-3 py-1 rounded-full shrink-0">
            <Sparkles size={13} />
            <span className="hidden md:inline">Experiencia Mística Activa</span>
            <span className="md:hidden">Activa</span>
          </div>
        </header>

        {/* Componente de la Experiencia */}
        <main className="w-full">
          {activeExp.num === 1 && (
            <div className="w-full">
              <ArchangelApp />
            </div>
          )}
          {activeExp.num === 2 && (
            <div className="py-4 sm:py-6 px-2 sm:px-8">
              <ChakraEnergyMap />
            </div>
          )}
          {activeExp.num === 3 && (
            <div className="py-4 sm:py-6 px-2 sm:px-8">
              <SolfeggioCymaticsTuner />
            </div>
          )}
          {activeExp.num === 18 && (
            <div className="py-4 sm:py-6 px-2 sm:px-8">
              <TibetanBowlsSanctuary />
            </div>
          )}
          {activeExp.num === 19 && (
            <div className="w-full h-[calc(100vh-65px)] overflow-hidden">
              <SomaticRainstick />
            </div>
          )}
          {activeExp.num === 20 && (
            <div className="w-full h-[calc(100vh-65px)] bg-[#030202] overflow-hidden">
              <iframe
                src="./espejo_de_obsidiana.html"
                title="Espejo de Obsidiana"
                className="w-full h-full border-0"
              />
            </div>
          )}
        </main>
      </div>
    );
  }

  // ============================================================
  // VISTA PRINCIPAL: MENÚ CATÁLOGO DE LAS 20 EXPERIENCIAS
  // ============================================================
  return (
    <div className="relative min-h-screen bg-[#0A0704] text-[#F8F9FA] overflow-x-hidden selection:bg-amber-500/30 selection:text-amber-200 pb-16">
      {/* Header Principal */}
      <header className="relative z-40 w-full pt-8 pb-6 px-4 sm:px-8 border-b border-white/[0.08] bg-gradient-to-b from-[#180E06]/90 to-[#0A0704]/95 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left space-y-1">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-300 text-xs font-semibold tracking-widest uppercase">
              <Sparkles size={13} className="animate-pulse" />
              <span>Suite Mística Interactiva</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-sacred font-bold text-white tracking-wider">
              Las 20 Experiencias Sagradas
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 font-sans max-w-xl">
              Portal cuántico de armonización acústica, oráculos milenarios y calibración energética corporal.
            </p>
          </div>

          {/* Búsqueda Rápida */}
          <div className="relative w-full md:w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400/70" />
            <input
              type="text"
              placeholder="Buscar experiencia o número..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-amber-400/25 bg-[#140D07]/80 text-sm text-white placeholder-stone-400 focus:outline-none focus:border-amber-400 shadow-inner"
            />
          </div>
        </div>

        {/* Filtros por Categoría */}
        <div className="max-w-7xl mx-auto mt-6 flex flex-wrap items-center justify-center md:justify-start gap-2 pt-4 border-t border-white/[0.06]">
          {[
            { id: "todos", label: "Todas las Experiencias (20)" },
            { id: "sonido", label: "🎵 Acústica & Sonido" },
            { id: "energia", label: "🌿 Chakras & Cuerpo" },
            { id: "oraculo", label: "🔮 Oráculos & Geometría" }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                filterCategory === cat.id
                  ? "border border-amber-400 bg-amber-400/20 text-amber-200 shadow-[0_0_15px_rgba(212,175,55,0.35)]"
                  : "border border-white/10 bg-white/5 text-stone-300 hover:text-white hover:border-white/25"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </header>

      {/* Grid de las 20 Tarjetas */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExperiences.map((exp) => {
            const isReady = exp.status === "active";
            return (
              <motion.div
                key={exp.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                onClick={() => {
                  if (isReady) {
                    handleLaunchExperience(exp.id);
                  } else {
                    setPreviewModalExp(exp);
                  }
                }}
                className={`relative rounded-3xl border p-6 flex flex-col justify-between transition-all cursor-pointer overflow-hidden group shadow-lg ${
                  isReady
                    ? "border-amber-500/35 bg-gradient-to-b from-[#1C140B]/90 via-[#130E07]/90 to-[#0A0704] hover:border-amber-400 hover:shadow-[0_0_30px_rgba(212,175,55,0.25)]"
                    : "border-white/10 bg-[#120C07]/60 hover:border-white/20"
                }`}
              >
                {/* Glow decorativo de fondo */}
                <div
                  className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"
                  style={{ backgroundColor: exp.colorHex }}
                />

                <div className="space-y-4">
                  {/* Encabezado de la Tarjeta */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg border border-amber-400/30 bg-amber-400/10 text-amber-300">
                      EXP {String(exp.num).padStart(2, "0")}
                    </span>

                    {isReady ? (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 size={12} />
                        Disponible Ahora
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-stone-400 border border-white/10 bg-white/5 px-2.5 py-0.5 rounded-full">
                        <Sparkles size={11} className="text-amber-300" />
                        Próximamente
                      </span>
                    )}
                  </div>

                  {/* Título y Subtítulo */}
                  <div>
                    <h3 className="text-xl font-sacred font-bold text-white group-hover:text-amber-200 transition-colors">
                      {exp.title}
                    </h3>
                    <p className="text-xs text-amber-400/90 font-sans mt-0.5 font-medium">
                      {exp.subtitle}
                    </p>
                  </div>

                  {/* Descripción Breve */}
                  <p className="text-xs text-stone-300 font-sans leading-relaxed line-clamp-3">
                    {exp.description}
                  </p>
                </div>

                {/* Pie de Tarjeta / Botón de Entrada */}
                <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between">
                  <span className="text-[11px] text-stone-400 font-sans">
                    {exp.categoryLabel}
                  </span>

                  <button
                    className={`flex items-center gap-1.5 text-xs font-semibold tracking-wider transition-all ${
                      isReady
                        ? "text-amber-300 group-hover:text-amber-200 group-hover:translate-x-1"
                        : "text-stone-400 group-hover:text-stone-300"
                    }`}
                  >
                    <span>{isReady ? "Entrar" : "Ver Detalles"}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* Modal de Previsualización para Experiencias en Creación */}
      <AnimatePresence>
        {previewModalExp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl border border-amber-400/35 bg-gradient-to-b from-[#1C140B] to-[#0A0704] shadow-2xl space-y-6"
            >
              <button
                onClick={() => setPreviewModalExp(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-stone-400 hover:text-white"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl border border-amber-400/40 bg-amber-400/15 text-amber-300">
                  EXP {String(previewModalExp.num).padStart(2, "0")}
                </span>
                <span className="text-xs text-amber-200/80 font-sans font-medium">
                  {previewModalExp.categoryLabel}
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-sacred font-bold text-white">
                  {previewModalExp.title}
                </h3>
                <p className="text-sm text-amber-300 font-sans mt-1">
                  {previewModalExp.subtitle}
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.03] space-y-2 text-xs sm:text-sm text-stone-300">
                <p className="leading-relaxed">
                  {previewModalExp.description}
                </p>
                <div className="pt-2 border-t border-white/10 flex items-center gap-2 text-amber-300 font-medium">
                  <Sparkles size={14} />
                  <span>Núcleo Sagrado: {previewModalExp.keyFeature}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-stone-400">
                  Estado: En fase de desarrollo y diseño místico
                </span>
                <button
                  onClick={() => setPreviewModalExp(null)}
                  className="px-5 py-2 rounded-full border border-amber-400 bg-amber-400/20 text-amber-200 text-xs font-semibold hover:bg-amber-400/30 transition-all cursor-pointer"
                >
                  Entendido
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ExperiencesHub;
