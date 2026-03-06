import { useNavigate } from "react-router-dom";
import paths from "@/utils/paths";
import Workspace from "@/models/workspace";
import { useTranslation } from "react-i18next";

export default function ExploreFeatures() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const chatWithAgent = async () => {
    const workspaces = await Workspace.all();
    if (workspaces.length > 0) {
      const firstWorkspace = workspaces[0];
      navigate(
        paths.workspace.chat(firstWorkspace.slug, {
          search: { action: "set-agent-chat" },
        })
      );
    }
  };

  const buildAgentFlow = () => navigate(paths.agents.builder());
  const setSlashCommand = async () => {
    const workspaces = await Workspace.all();
    if (workspaces.length > 0) {
      const firstWorkspace = workspaces[0];
      navigate(
        paths.workspace.chat(firstWorkspace.slug, {
          search: { action: "open-new-slash-command-modal" },
        })
      );
    }
  };



  const setSystemPrompt = async () => {
    const workspaces = await Workspace.all();
    if (workspaces.length > 0) {
      const firstWorkspace = workspaces[0];
      navigate(
        paths.workspace.settings.chatSettings(firstWorkspace.slug, {
          search: { action: "focus-system-prompt" },
        })
      );
    }
  };

  const managePromptVariables = () => {
    navigate(paths.settings.systemPromptVariables());
  };

  return (
    <div>
      <h1 className="text-theme-home-text uppercase text-sm font-semibold mb-4">
        {t("main-page.exploreMore.title")}
      </h1>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <FeatureCard
          title={t("main-page.exploreMore.features.customAgents.title")}
          description={t(
            "main-page.exploreMore.features.customAgents.description"
          )}
          primaryAction={t(
            "main-page.exploreMore.features.customAgents.primaryAction"
          )}
          secondaryAction={t(
            "main-page.exploreMore.features.customAgents.secondaryAction"
          )}
          onPrimaryAction={chatWithAgent}
          onSecondaryAction={buildAgentFlow}
          isNew={true}
        />
        <FeatureCard
          title={t("main-page.exploreMore.features.slashCommands.title")}
          description={t(
            "main-page.exploreMore.features.slashCommands.description"
          )}
          primaryAction={t(
            "main-page.exploreMore.features.slashCommands.primaryAction"
          )}
          onPrimaryAction={setSlashCommand}
          isNew={false}
        />
        <FeatureCard
          title={t("main-page.exploreMore.features.systemPrompts.title")}
          description={t(
            "main-page.exploreMore.features.systemPrompts.description"
          )}
          primaryAction={t(
            "main-page.exploreMore.features.systemPrompts.primaryAction"
          )}
          secondaryAction={t(
            "main-page.exploreMore.features.systemPrompts.secondaryAction"
          )}
          onPrimaryAction={setSystemPrompt}
          onSecondaryAction={managePromptVariables}
          isNew={true}
        />
      </div>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  primaryAction,
  secondaryAction,
  onPrimaryAction,
  onSecondaryAction,
  isNew,
}) {
  return (
    <div className="border border-white/10 bg-white/3 backdrop-blur-sm rounded-xl py-5 px-6 flex flex-col justify-between gap-y-4 shadow-md shadow-black/10 card-glow hover:-translate-y-0.5 transition-transform duration-300">
      <div className="flex flex-col gap-y-2">
        <h2 className="text-black font-bold text-base flex items-center gap-x-2 tracking-wide">
          {title}
        </h2>
        <p className="text-black/85 text-sm leading-relaxed">{description}</p>
      </div>
      <div className="flex flex-col gap-y-[10px]">
        <button
          onClick={onPrimaryAction}
          className="w-full h-[38px] bg-gradient-to-r from-blue-600/80 to-indigo-600/80 hover:from-blue-500/90 hover:to-indigo-500/90 border-none text-white rounded-lg text-sm font-semibold flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-blue-500/20 hover:shadow-md"
        >
          {primaryAction}
        </button>
        {secondaryAction && (
          <div className="relative w-full">
            {isNew && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2 px-2.5 py-0.5 font-bold rounded-full text-[10px] text-teal-900 bg-teal-400 shadow-[0_0_10px_rgba(45,212,191,0.6)] uppercase tracking-wider">
                New
              </div>
            )}
            <button
              onClick={onSecondaryAction}
              className="w-full h-[38px] bg-slate-800/80 hover:bg-slate-700/80 border border-slate-600/50 rounded-lg text-white text-sm font-medium flex items-center justify-center transition-all duration-200"
            >
              {secondaryAction}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
