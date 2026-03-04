import React from "react";
import QuickLinks from "./QuickLinks";
import ExploreFeatures from "./ExploreFeatures";
import Checklist from "./Checklist";
import { isMobile } from "react-device-detect";
import { Globe } from "@phosphor-icons/react";

function WelcomeBanner() {
  return (
    <div className="w-full rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-8 md:p-10">
      <div className="flex flex-col gap-y-3">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Bienvenido a Questiona
        </h1>
        <p className="text-base text-gray-600 max-w-[700px] leading-relaxed">
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
      <h2 className="text-theme-home-text uppercase text-sm font-semibold mb-4">
        Contacto
      </h2>
      <div className="border border-theme-home-border rounded-2xl p-6 bg-white/60">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-blue-100 flex-shrink-0">
            <Globe className="w-6 h-6 text-indigo-600" weight="duotone" />
          </div>
          <div className="flex flex-col gap-y-1 flex-grow">
            <p className="text-theme-home-text font-semibold text-sm">
              Codegenia
            </p>
            <p className="text-theme-home-text-secondary text-sm">
              ¿Tienes preguntas o necesitas ayuda? Visita nuestra web para más información y soporte.
            </p>
          </div>
          <a
            href="https://codegenia.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md flex-shrink-0"
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
    <div className="w-full border-t border-theme-home-border pt-6 pb-4 mt-4">
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
      className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[20px] bg-theme-bg-container w-full h-full"
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
