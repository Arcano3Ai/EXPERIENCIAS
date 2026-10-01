"use client";

import React, { useState, useRef } from "react";
import { ArchangelPortal } from "./ArchangelPortal";

export function App() {
  const [isAudioActive, setIsAudioActive] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  // Sintetizador Sagrado a 528 Hz (Frecuencia Solfeggio del Milagro / Amor)
  const toggleSacredAudio = () => {
    if (isAudioActive) {
      if (oscRef.current) {
        try {
          oscRef.current.stop();
          oscRef.current.disconnect();
        } catch (e) {}
        oscRef.current = null;
      }
      setIsAudioActive(false);
    } else {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(528, ctx.currentTime); // 528 Hz Amor y Reparacion

        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 2);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();

        oscRef.current = osc;
        gainRef.current = gain;
        setIsAudioActive(true);
      } catch (err) {
        console.error("Audio error:", err);
      }
    }
  };

  const whatsappUrl = "https://wa.me/528110444618?text=" + encodeURIComponent("Hola Jess, deseo agendar una sesión en Nexos Estelares");
  const whatsappTallerUrl = "https://wa.me/528110444618?text=" + encodeURIComponent("Hola Jess, deseo información y reservar mi lugar para las Membresías y Talleres de Arcángeles ($369 MXN)");

  return (
    <div className="relative min-h-screen bg-[#040508] text-[#F8F9FA] overflow-x-hidden">
      {/* ============================================================ */}
      {/* 1. HEADER TRANSLUCIDO ESTILO MOCKUP                           */}
      {/* ============================================================ */}
      <header className="relative z-50 w-full pt-6 pb-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Navegacion Izquierda */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#inicio" className="text-sm font-medium tracking-wider uppercase text-amber-100/90 hover:text-[#F5D77F] transition-colors">
              Inicio
            </a>
            <a href="#membresias" className="text-sm font-medium tracking-wider uppercase text-amber-100/90 hover:text-[#F5D77F] transition-colors">
              Membresías
            </a>
            <a href="#portal-arcangeles" className="text-sm font-medium tracking-wider uppercase text-amber-100/90 hover:text-[#F5D77F] transition-colors">
              Portal Sagrado
            </a>
          </nav>

          {/* Logotipo Central Caligrafico con Destellos */}
          <div className="flex flex-col items-center justify-center text-center mx-auto md:mx-0">
            <a href="#inicio" className="group flex flex-col items-center">
              <span className="font-celestial text-3xl sm:text-4xl md:text-5xl text-[#F5D77F] tracking-wide drop-shadow-[0_0_20px_rgba(245,215,127,0.65)] group-hover:scale-105 transition-transform duration-300">
                Nexos Estelares
              </span>
              <div className="flex items-center space-x-2 mt-0.5">
                <span className="text-[#D4AF37] text-xs">✦</span>
                <span className="text-[11px] sm:text-xs tracking-[0.25em] text-[#DDD6FE] uppercase font-light">
                  Reiki y Tarot con Jess
                </span>
                <span className="text-[#D4AF37] text-xs">✦</span>
              </div>
            </a>
          </div>

          {/* Navegacion Derecha & Acciones */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            <a href="#testimonios" className="hidden md:inline-block text-sm font-medium tracking-wider uppercase text-amber-100/90 hover:text-[#F5D77F] transition-colors">
              Testimonios
            </a>

            {/* Boton Audio Frecuencia Sagrada 528Hz */}
            <button
              onClick={toggleSacredAudio}
              title="Frecuencia Sagrada 528 Hz"
              aria-label="Frecuencia Sagrada 528 Hz"
              className={`p-2.5 rounded-full border transition-all duration-300 ${
                isAudioActive
                  ? "bg-purple-900/60 border-[#F5D77F] text-[#F5D77F] shadow-[0_0_15px_rgba(245,215,127,0.5)]"
                  : "bg-white/5 border-white/10 text-amber-200/80 hover:border-[#D4AF37]"
              }`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              </svg>
            </button>

            {/* CTA Header */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-epic-portal text-xs sm:text-sm px-4 sm:px-6 py-2 sm:py-2.5 shadow-lg"
            >
              Agenda tu Sesión
            </a>
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/* 2. HERO: PORTAL EPICO CELESTIAL CON ARCO Y ANGELES           */}
      {/* ============================================================ */}
      <section id="inicio" className="relative pt-6 pb-20 px-4 sm:px-6 text-center flex flex-col items-center justify-center min-h-[82vh]">
        {/* Arco de luz dorado celestial */}
        <div className="portal-arch-halo"></div>

        {/* Alas de Arcangeles a los costados del cielo */}
        <div className="angel-wing-left hidden lg:block"></div>
        <div className="angel-wing-right hidden lg:block"></div>

        {/* Resplandor Central */}
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          {/* Badge Celestial */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/40 border border-[#D4AF37]/50 backdrop-blur-md mb-6 shadow-[0_0_20px_rgba(124,58,237,0.3)]">
            <span className="text-[#F5D77F] text-xs">✦</span>
            <span className="text-xs sm:text-sm tracking-[0.2em] uppercase text-[#F5D77F] font-medium">
              Santuario Holístico & Sanación Cuántica
            </span>
            <span className="text-[#F5D77F] text-xs">✦</span>
          </div>

          {/* Titulo Identico al Mockup */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-sacred font-normal tracking-wide text-white drop-shadow-[0_0_35px_rgba(124,58,237,0.4)] mb-4">
            Despierta tu{" "}
            <span className="font-celestial text-5xl sm:text-7xl md:text-8xl text-[#F5D77F] drop-shadow-[0_0_30px_rgba(245,215,127,0.7)] ml-1">
              Luz Interior
            </span>
          </h1>

          {/* Subtitulo Identico al Mockup */}
          <p className="text-lg sm:text-2xl font-editorial italic text-[#DDD6FE] max-w-2xl mx-auto mb-8 font-light drop-shadow-md">
            Conecta con la energía de los planos estelares
          </p>

          {/* Boton Principal Capsula Amatista con Ribete de Oro */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-epic-portal text-base sm:text-lg px-8 sm:px-12 py-3.5 sm:py-4 shadow-[0_10px_35px_rgba(91,43,133,0.6)] cursor-pointer"
          >
            Agenda tu Sesión
          </a>
        </div>

        {/* ============================================================ */}
        {/* 3. LAS 4 TARJETAS DEL MOCKUP CON PLACA MARFIL                 */}
        {/* ============================================================ */}
        <div className="relative z-10 w-full max-w-6xl mx-auto mt-16 sm:mt-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
            {/* Tarjeta 1: Canalizacion con Arcangeles */}
            <div
              onClick={() => {
                const el = document.getElementById("portal-arcangeles");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="group cursor-pointer rounded-2xl overflow-hidden border border-[#D4AF37]/45 bg-[#120E24]/85 shadow-[0_15px_35px_rgba(0,0,0,0.6)] hover:border-[#F5D77F] hover:shadow-[0_20px_45px_rgba(245,215,127,0.35)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
            >
              <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-purple-950">
                <img
                  src="./assets/Media/service_cuantica.jpg"
                  alt="Canalización con Arcángeles"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
              <div className="service-ivory-plate py-4 px-3 flex flex-col items-center justify-center text-center">
                <h3 className="font-sacred font-bold text-base text-[#2B1242] tracking-wide">
                  Canalización
                </h3>
                <span className="text-xs text-[#6B4E7A] font-semibold tracking-wider">
                  con Arcángeles
                </span>
              </div>
            </div>

            {/* Tarjeta 2: Tarot Evolutivo */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group cursor-pointer rounded-2xl overflow-hidden border border-[#D4AF37]/45 bg-[#120E24]/85 shadow-[0_15px_35px_rgba(0,0,0,0.6)] hover:border-[#F5D77F] hover:shadow-[0_20px_45px_rgba(245,215,127,0.35)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
            >
              <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-purple-950">
                <img
                  src="./assets/Media/service_tarot.jpg"
                  alt="Tarot Evolutivo"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
              <div className="service-ivory-plate py-4 px-3 flex flex-col items-center justify-center text-center">
                <h3 className="font-sacred font-bold text-base text-[#2B1242] tracking-wide">
                  — Tarot —
                </h3>
                <span className="text-xs text-[#6B4E7A] font-semibold tracking-wider">
                  — Evolutivo —
                </span>
              </div>
            </a>

            {/* Tarjeta 3: Sanacion Cuantica */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group cursor-pointer rounded-2xl overflow-hidden border border-[#D4AF37]/45 bg-[#120E24]/85 shadow-[0_15px_35px_rgba(0,0,0,0.6)] hover:border-[#F5D77F] hover:shadow-[0_20px_45px_rgba(245,215,127,0.35)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
            >
              <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-purple-950">
                <img
                  src="./assets/Media/service_reiki.jpg"
                  alt="Sanación Cuántica"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
              <div className="service-ivory-plate py-4 px-3 flex flex-col items-center justify-center text-center">
                <h3 className="font-sacred font-bold text-base text-[#2B1242] tracking-wide">
                  — Sanación —
                </h3>
                <span className="text-xs text-[#6B4E7A] font-semibold tracking-wider">
                  — Cuántica —
                </span>
              </div>
            </a>

            {/* Tarjeta 4: Activacion Kundalini */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group cursor-pointer rounded-2xl overflow-hidden border border-[#D4AF37]/45 bg-[#120E24]/85 shadow-[0_15px_35px_rgba(0,0,0,0.6)] hover:border-[#F5D77F] hover:shadow-[0_20px_45px_rgba(245,215,127,0.35)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
            >
              <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-purple-950 flex items-center justify-center">
                <img
                  src="./assets/Media/service_kundalini.svg"
                  alt="Activación Kundalini"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
              <div className="service-ivory-plate py-4 px-3 flex flex-col items-center justify-center text-center">
                <h3 className="font-sacred font-bold text-base text-[#2B1242] tracking-wide">
                  — Activación —
                </h3>
                <span className="text-xs text-[#6B4E7A] font-semibold tracking-wider">
                  — Kundalini —
                </span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. FRASE PUENTE EDITORIAL                                    */}
      {/* ============================================================ */}
      <section className="relative py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-celestial text-4xl sm:text-5xl md:text-6xl text-[#F5D77F] drop-shadow-[0_0_20px_rgba(245,215,127,0.5)] mb-3">
            Guía espiritual para tu bienestar y evolución
          </h2>
          <p className="font-sacred text-xs sm:text-sm md:text-base tracking-[0.25em] uppercase text-[#DDD6FE] font-medium">
            Reiki · Tarot · Sanación Energética
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. SECCION JESSICA RAMIREZ (FOTO IZQUIERDA + TEXTO DERECHA)   */}
      {/* ============================================================ */}
      <section id="sobre-jess" className="relative py-20 px-4 sm:px-6 bg-gradient-to-b from-transparent via-purple-950/20 to-transparent">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Foto de Jess con Tarot */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-md rounded-2xl overflow-hidden border-2 border-[#D4AF37] shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_40px_rgba(212,175,55,0.35)]">
              <img
                src="./assets/Media/jessica_ramirez.jpg"
                alt="Con Reiki y Tarot con Jess"
                className="w-full h-auto object-cover transform hover:scale-102 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Textos y Boton estilo Mockup */}
          <div className="flex flex-col text-left">
            <h2 className="font-celestial text-4xl sm:text-5xl lg:text-6xl text-[#F5D77F] drop-shadow-[0_0_25px_rgba(245,215,127,0.5)] mb-3 leading-tight">
              Con Reiki y Tarot con Jess
            </h2>
            <h3 className="font-editorial text-xl sm:text-2xl text-[#DDD6FE] italic mb-6">
              Acompañando tu proceso de sanación y autoconocimiento
            </h3>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-8 font-light">
              Soy <strong>Jessica Ramírez</strong>, canalizadora holística, sanadora cuántica y terapeuta con base en Monterrey, Nuevo León. Acompaño tu despertar combinando la sabiduría milenaria del Tarot Terapéutico y el Reiki Tradicional con la alta frecuencia de los Arcángeles, en sesiones presenciales y online para todo el mundo.
            </p>
            <div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-epic-portal text-sm sm:text-base px-8 py-3.5 shadow-lg"
              >
                Conoce Más
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. EXPERIENCIA INTERACTIVA: PORTAL SAGRADO DE LOS ARCANGELES */}
      {/* ============================================================ */}
      <section id="portal-arcangeles" className="relative py-16 px-4">
        <div className="max-w-5xl mx-auto text-center mb-8">
          <span className="text-[#F5D77F] text-xs tracking-[0.22em] uppercase font-sacred">
            ✦ Experiencia Sagrada Interactiva ✦
          </span>
          <h2 className="font-celestial text-4xl sm:text-5xl text-[#F5D77F] mt-2 mb-3">
            El Portal de los 7 Arcángeles
          </h2>
          <p className="text-sm sm:text-base text-[#DDD6FE] max-w-xl mx-auto italic font-editorial">
            Toca una esfera para sintonizar con su rayo celestial, activar su frecuencia y canalizar tu decreto personal.
          </p>
        </div>

        {/* Componente ArchangelPortal */}
        <div className="w-full max-w-5xl mx-auto rounded-3xl overflow-hidden border border-[#D4AF37]/35 shadow-[0_25px_60px_rgba(0,0,0,0.85)] bg-[#040508]/90 backdrop-blur-xl">
          <ArchangelPortal />
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. DUO INFERIOR: TESTIMONIOS & MEMBRESIAS (ESTILO MOCKUP)     */}
      {/* ============================================================ */}
      <section id="membresias" className="relative py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          
          {/* Bloque Izquierdo: Testimonios */}
          <div id="testimonios" className="rounded-3xl p-8 sm:p-10 border border-[#D4AF37]/40 bg-[#120E24]/85 backdrop-blur-md shadow-[0_20px_45px_rgba(0,0,0,0.7)] flex flex-col justify-between text-center">
            <div>
              <h3 className="font-sacred text-2xl sm:text-3xl text-[#F5D77F] tracking-wide mb-1">
                — Testimonios —
              </h3>
              <p className="font-editorial text-lg text-[#DDD6FE] italic mb-6">
                “Experiencias que transforman”
              </p>

              {/* Fila de 4 Avatares de Consultantes del Mockup */}
              <div className="flex items-center justify-center gap-3 sm:gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl border border-[#D4AF37] overflow-hidden shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                  <img src="./assets/Media/jessica_ramirez.jpg" alt="Consultante" className="w-full h-full object-cover" />
                </div>
                <div className="w-16 h-16 rounded-xl border border-[#D4AF37] overflow-hidden shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                  <img src="./assets/Media/circulo_arcangeles.jpg" alt="Consultante" className="w-full h-full object-cover" />
                </div>
                <div className="w-16 h-16 rounded-xl border border-[#D4AF37] overflow-hidden shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                  <img src="./assets/Media/service_tarot.jpg" alt="Consultante" className="w-full h-full object-cover" />
                </div>
                <div className="w-16 h-16 rounded-xl border border-[#D4AF37] overflow-hidden shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                  <img src="./assets/Media/service_cuantica.jpg" alt="Consultante" className="w-full h-full object-cover" />
                </div>
              </div>

              <p className="font-editorial italic text-base sm:text-lg text-white leading-relaxed mb-6">
                "Llegué con pesadez y confusión; la sesión con Jess me devolvió el eje, la serenidad y la certeza que había perdido. Su contención es sagrada."
              </p>
            </div>

            <div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-full border border-[#D4AF37]/50 text-xs sm:text-sm text-[#F5D77F] hover:bg-[#D4AF37]/15 transition-all"
              >
                Escribir a Jess
              </a>
            </div>
          </div>

          {/* Bloque Derecho: Membresías & Talleres */}
          <div className="rounded-3xl p-8 sm:p-10 border border-[#D4AF37]/40 bg-[#120E24]/85 backdrop-blur-md shadow-[0_20px_45px_rgba(0,0,0,0.7)] flex flex-col justify-between text-center">
            <div>
              <h3 className="font-sacred text-2xl sm:text-3xl text-[#F5D77F] tracking-wide mb-1">
                Membresías
              </h3>
              <p className="font-editorial text-lg text-[#DDD6FE] italic mb-6">
                Nexos Estelares · Círculo de Arcángeles
              </p>

              {/* Banner con Velas y Altar de Cuarzos */}
              <div className="w-full h-36 rounded-xl border border-[#D4AF37]/40 overflow-hidden mb-5">
                <img
                  src="./assets/Media/circulo_arcangeles.jpg"
                  alt="Altar de Purificación y Membresías"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="mb-4">
                <span className="font-sacred text-xl sm:text-2xl text-[#F5D77F] font-bold">
                  Aportación: $369 MXN <small className="text-xs text-[#DDD6FE] font-normal">/ $22 USD</small>
                </span>
                <p className="text-xs text-gray-300 mt-1">
                  Ceremonias y Talleres de Purificación vía ZOOM · Cupo Limitado
                </p>
              </div>
            </div>

            <div>
              <a
                href={whatsappTallerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-epic-portal text-xs sm:text-sm px-8 py-3.5 shadow-lg w-full sm:w-auto"
              >
                Ver Membresías
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 8. FOOTER SAGRADO CON CREDITO ARCANO SOLUTIONS               */}
      {/* ============================================================ */}
      <footer className="relative z-10 border-t border-[#D4AF37]/25 bg-[#030407] py-12 px-4 sm:px-8 text-center text-xs sm:text-sm text-gray-400">
        <div className="max-w-6xl mx-auto flex flex-col items-center justify-center space-y-4">
          <div className="flex flex-col items-center">
            <span className="font-celestial text-3xl text-[#F5D77F]">Nexos Estelares</span>
            <span className="text-[10px] tracking-[0.25em] text-[#DDD6FE] uppercase mt-1">Reiki y Tarot con Jess · Monterrey, México</span>
          </div>

          <p className="max-w-md text-gray-400 text-xs">
            Sesiones de Sanación Cuántica, Tarot Terapéutico y Reiki Usui en Monterrey, N.L. y atención online internacional vía Zoom y Meet.
          </p>

          <div className="flex items-center space-x-6 text-xs text-[#F5D77F]">
            <a href="https://wa.me/528110444618" target="_blank" rel="noopener noreferrer" className="hover:underline">
              WhatsApp: +52 81 1044 4618
            </a>
            <a href="https://www.instagram.com/nexos_estelares/" target="_blank" rel="noopener noreferrer" className="hover:underline">
              Instagram
            </a>
            <a href="https://www.facebook.com/NexosEstelares" target="_blank" rel="noopener noreferrer" className="hover:underline">
              Facebook
            </a>
          </div>

          <div className="pt-6 border-t border-white/5 w-full flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
            <span>© 2026 Nexos Estelares con Jessica Ramírez. Todos los derechos reservados.</span>
            <span className="mt-2 sm:mt-0">
              Desarrollado por{" "}
              <a
                href="https://arcanosolutions.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F5D77F] hover:underline font-medium"
              >
                arcanosolutions.com
              </a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
