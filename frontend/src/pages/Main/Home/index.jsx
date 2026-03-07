import React from "react";
import QuickLinks from "./QuickLinks";
import ExploreFeatures from "./ExploreFeatures";
import Checklist from "./Checklist";
import { isMobile } from "react-device-detect";
import { Globe } from "@phosphor-icons/react";

function WelcomeBanner() {
  return (
    <div className="relative w-full rounded-3xl bg-gradient-to-br from-indigo-500/[0.07] via-purple-500/[0.04] to-transparent border border-white/[0.04] p-8 md:p-10 overflow-hidden">
      {/* Decorative blurred background shapes */}
      <div className="absolute top-[-50%] left-[-10%] w-[50%] h-[200%] bg-indigo-500/[0.06] blur-[100px] rounded-full rotate-12 pointer-events-none" />
      <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[150%] bg-purple-500/[0.04] blur-[100px] rounded-full -rotate-12 pointer-events-none" />
      <div className="relative z-10 flex flex-col gap-y-3">
        <h1 className="text-2xl md:text-3xl font-bold text-white light:text-slate-900">
          Bienvenido a Questiona
        </h1>
        <p className="text-base text-slate-300/90 light:text-slate-600 max-w-[700px] leading-relaxed">
          Tu espacio de trabajo privado de IA para conversaciones inteligentes, análisis de documentos y gestión del conocimiento.
          Selecciona un espacio de trabajo en la barra lateral para empezar a chatear o crea uno nuevo para organizar mejor tu trabajo.
        </p>
      </div>
    </div>
  );
}

function ContactSection() {
  return (
    <div className="w-full">
      <h2 className="text-theme-home-text uppercase text-sm font-semibold mb-4 tracking-wider flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
        Contacto
      </h2>
      <div className="border border-white/[0.04] light:border-slate-200 rounded-2xl p-6 bg-white/[0.02] light:bg-white backdrop-blur-sm light:shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-500/[0.08] border border-indigo-500/10 flex-shrink-0">
            <Globe className="w-6 h-6 text-indigo-400" weight="duotone" />
          </div>
          <div className="flex flex-col gap-y-1 flex-grow">
            <p className="text-white light:text-black font-bold text-sm">
              Codegenia
            </p>
            <p className="text-white/70 light:text-black/70 text-sm">
              ¿Tienes preguntas o necesitas ayuda? Visita nuestra web para más información y soporte.
            </p>
          </div>
          <a
            href="https://codegenia.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-x-2 px-6 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-semibold transition-all duration-300 flex-shrink-0"
          >
            <Globe className="w-4 h-4" />
            Visitar web
          </a>
        </div>
      </div>
    </div>
  );
}

function HomeFooter() {
  return (
    <div className="relative w-full border-t border-white/[0.04] light:border-slate-200 pt-6 pb-4 mt-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-y-3">
        <div className="flex items-center gap-x-2">
          <span className="text-theme-home-text-secondary text-xs">
            © {new Date().getFullYear()} Questiona · Desarrollado por{" "}
            <a
              href="https://codegenia.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200"
            >
              Codegenia
            </a>
          </span>
        </div>
        <div className="flex items-center gap-x-4">
          <a
            href="https://codegenia.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-theme-home-text-secondary hover:text-indigo-600 text-xs font-medium transition-colors duration-200"
          >
            codegenia.com
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div
      style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
      className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[24px] bg-theme-bg-container w-full h-full"
    >
      <div className="w-full h-full flex flex-col items-center overflow-y-auto no-scroll">
        <div className="w-full max-w-[1200px] flex flex-col gap-y-[24px] p-4 pt-16 md:p-12 md:pt-11">
          <WelcomeBanner />
          <Checklist />
          <QuickLinks />
          <ExploreFeatures />
          <ContactSection />
          <HomeFooter />
        </div>
      </div>
    </div>
  );
}
