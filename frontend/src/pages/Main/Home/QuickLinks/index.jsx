import { ChatCenteredDots, FileArrowDown, Plus, CaretDown } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import Workspace from "@/models/workspace";
import paths from "@/utils/paths";
import { useManageWorkspaceModal } from "@/components/Modals/ManageWorkspace";
import ManageWorkspace from "@/components/Modals/ManageWorkspace";
import { useState } from "react";
import { useNewWorkspaceModal } from "@/components/Modals/NewWorkspace";
import NewWorkspaceModal from "@/components/Modals/NewWorkspace";
import showToast from "@/utils/toast";
import { useTranslation } from "react-i18next";

function QuickLinkCard({ icon: Icon, label, description, onClick }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex flex-col">
      <button
        onClick={onClick}
        className="h-[45px] text-sm font-semibold bg-theme-home-button-secondary rounded-xl text-theme-home-button-secondary-text flex items-center justify-center gap-x-2.5 transition-all duration-200 hover:bg-theme-home-button-secondary-hover hover:text-theme-home-button-secondary-hover-text"
      >
        <Icon size={16} />
        {label}
      </button>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-center gap-x-1 mt-1.5 py-1 text-xs text-theme-home-text-secondary hover:text-indigo-600 transition-colors duration-200 cursor-pointer"
      >
        <span>{expanded ? "Ocultar info" : "¿Qué es esto?"}</span>
        <CaretDown
          size={10}
          className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          expanded ? "max-h-[120px] opacity-100 mt-1" : "max-h-0 opacity-0"
        }`}
      >
        <div className="text-xs text-theme-home-text-secondary bg-theme-home-bg-card rounded-lg px-3 py-2.5 leading-relaxed border border-theme-home-border/50">
          {description}
        </div>
      </div>
    </div>
  );
}

export default function QuickLinks() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showModal } = useManageWorkspaceModal();
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const {
    showing: showingNewWsModal,
    showModal: showNewWsModal,
    hideModal: hideNewWsModal,
  } = useNewWorkspaceModal();

  const sendChat = async () => {
    const workspaces = await Workspace.all();
    if (workspaces.length > 0) {
      const firstWorkspace = workspaces[0];
      navigate(paths.workspace.chat(firstWorkspace.slug));
    } else {
      showToast(t("main-page.noWorkspaceError"), "warning", {
        clear: true,
      });
      showNewWsModal();
    }
  };

  const embedDocument = async () => {
    const workspaces = await Workspace.all();
    if (workspaces.length > 0) {
      const firstWorkspace = workspaces[0];
      setSelectedWorkspace(firstWorkspace);
      showModal();
    } else {
      showToast(t("main-page.noWorkspaceError"), "warning", {
        clear: true,
      });
      showNewWsModal();
    }
  };

  const createWorkspace = () => {
    showNewWsModal();
  };

  return (
    <div>
      <h1 className="text-theme-home-text uppercase text-sm font-semibold mb-4">
        {t("main-page.quickLinks.title")}
      </h1>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <QuickLinkCard
          icon={ChatCenteredDots}
          label={t("main-page.quickLinks.sendChat")}
          description="Abre un espacio de trabajo y empieza a chatear con la IA. Puedes hacer preguntas, generar contenido y obtener respuestas basadas en tus documentos."
          onClick={sendChat}
        />
        <QuickLinkCard
          icon={FileArrowDown}
          label={t("main-page.quickLinks.embedDocument")}
          description="Sube y vincula documentos a un espacio de trabajo. La IA podrá utilizar esos documentos como contexto para ofrecerte respuestas más precisas y relevantes."
          onClick={embedDocument}
        />
        <QuickLinkCard
          icon={Plus}
          label={t("main-page.quickLinks.createWorkspace")}
          description="Crea un nuevo espacio de trabajo para organizar tus conversaciones y documentos por tema o proyecto. Cada espacio tiene su propio contexto."
          onClick={createWorkspace}
        />
      </div>

      {selectedWorkspace && (
        <ManageWorkspace
          providedSlug={selectedWorkspace.slug}
          hideModal={() => {
            setSelectedWorkspace(null);
          }}
        />
      )}

      {showingNewWsModal && <NewWorkspaceModal hideModal={hideNewWsModal} />}
    </div>
  );
}
