# AnythingLLM — Functionality Map

> A complete guide to where each functionality lives in the codebase, so you can locate and edit any feature quickly.

---

## 📁 High-Level Architecture

| Directory | Purpose |
|-----------|---------|
| `server/` | Backend API (Express.js), database models, LLM/agent/vector utilities |
| `frontend/` | React (Vite) single-page app — UI components, pages, API clients |
| `collector/` | Document ingestion service — processes files, links, and raw text into embeddings |
| `docker/` | Dockerfile, docker-compose, and environment config for containerised deployment |
| `embed/` | Embeddable chat-widget for third-party websites |
| `browser-extension/` | Browser extension source |
| `cloud-deployments/` | Deployment templates for various cloud providers |
| `locales/` | i18n / translation files |

---

## 🤖 Agents Configuration

| What | Path |
|------|------|
| **Agent core logic & orchestration** | `server/utils/agents/index.js` |
| **Agent defaults** | `server/utils/agents/defaults.js` |
| **Ephemeral agents** | `server/utils/agents/ephemeral.js` |
| **Imported agents** | `server/utils/agents/imported.js` |
| **AIbitat framework (core engine)** | `server/utils/agents/aibitat/index.js` |
| **AIbitat LLM providers** | `server/utils/agents/aibitat/providers/` (35 files) |
| **Agent skills / plugins** | `server/utils/agents/aibitat/plugins/` — see below |
| **Agent WebSocket endpoint** | `server/endpoints/agentWebsocket.js` |
| **Agent invocation model** | `server/models/workspaceAgentInvocation.js` |
| **Frontend — Agent config page** | `frontend/src/pages/Admin/Agents/index.jsx` |
| **Frontend — Agent skills list** | `frontend/src/pages/Admin/Agents/skills.js` |
| **Frontend — MCP Servers panel (inside Agents)** | `frontend/src/pages/Admin/Agents/MCPServers/` |
| **Frontend — SQL Connector selection** | `frontend/src/pages/Admin/Agents/SQLConnectorSelection/` |
| **Frontend — Web Search selection** | `frontend/src/pages/Admin/Agents/WebSearchSelection/` |
| **Frontend — Workspace-level agent config** | `frontend/src/pages/WorkspaceSettings/AgentConfig/` |

### Agent Skills / Plugins

| Plugin file | Capability |
|-------------|-----------|
| `web-browsing.js` | Web browsing & search |
| `web-scraping.js` | Web page scraping |
| `sql-agent/` | SQL database querying |
| `memory.js` | Long-term memory |
| `summarize.js` | Text summarisation |
| `rechart.js` | Chart generation |
| `save-file-browser.js` | File saving from browser |
| `chat-history.js` | Chat history access |
| `file-history.js` | File history access |
| `cli.js` | CLI command execution |
| `http-socket.js` | HTTP socket connections |

> All located under `server/utils/agents/aibitat/plugins/`

---

## 🔌 MCP (Model Context Protocol) Configuration

| What | Path |
|------|------|
| **MCP server manager (backend)** | `server/utils/MCP/index.js` |
| **MCP hypervisor** | `server/utils/MCP/hypervisor/` |
| **MCP API endpoints** | `server/endpoints/mcpServers.js` |
| **Frontend — MCP API client** | `frontend/src/models/mcpServers.js` |
| **Frontend — MCP panel (inside Agent config)** | `frontend/src/pages/Admin/Agents/MCPServers/` |

---

## 🧠 LLM / AI Provider Configuration

| What | Path |
|------|------|
| **All LLM provider implementations** | `server/utils/AiProviders/` |
| **Frontend — LLM selection components** | `frontend/src/components/LLMSelection/` (37 sub-components) |
| **Frontend — LLM preference settings page** | `frontend/src/pages/GeneralSettings/LLMPreference/` |

### Supported LLM Providers (each a subfolder of `server/utils/AiProviders/`)

`anthropic` · `apipie` · `azureOpenAi` · `bedrock` · `cohere` · `cometapi` · `deepseek` · `dellProAiStudio` · `fireworksAi` · `foundry` · `gemini` · `genericOpenAi` · `giteeai` · `groq` · `huggingface` · `koboldCPP` · `liteLLM` · `lmStudio` · `localAi` · `mistral` · `moonshotAi` · `novita` · `nvidiaNim` · `ollama` · `openAi` · `openRouter` · `perplexity` · `ppio` · `textGenWebUI` · `togetherAi` · `xai` · `zai`

---

## 📐 Embedding Engine Configuration

| What | Path |
|------|------|
| **All embedding providers** | `server/utils/EmbeddingEngines/` |
| **Embedding rerankers** | `server/utils/EmbeddingRerankers/` |
| **Frontend — Embedding selection components** | `frontend/src/components/EmbeddingSelection/` (14 sub-components) |
| **Frontend — Embedding preference page** | `frontend/src/pages/GeneralSettings/EmbeddingPreference/` |
| **Frontend — Text splitter preference** | `frontend/src/pages/GeneralSettings/EmbeddingTextSplitterPreference/` |
| **Text splitter logic (backend)** | `server/utils/TextSplitter/` |

### Supported Embedding Engines

`azureOpenAi` · `cohere` · `gemini` · `genericOpenAi` · `liteLLM` · `lmstudio` · `localAi` · `mistral` · `native` · `ollama` · `openAi` · `openRouter` · `voyageAi`

---

## 🗄️ Vector Database Configuration

| What | Path |
|------|------|
| **All vector DB providers** | `server/utils/vectorDbProviders/` |
| **Vector store logic** | `server/utils/vectorStore/` |
| **Frontend — VectorDB selection components** | `frontend/src/components/VectorDBSelection/` (11 sub-components) |
| **Frontend — VectorDB settings page** | `frontend/src/pages/GeneralSettings/VectorDatabase/` |
| **Frontend — Workspace-level VectorDB settings** | `frontend/src/pages/WorkspaceSettings/VectorDatabase/` |

### Supported Vector Databases

`astra` · `chroma` · `chromacloud` · `lance` · `milvus` · `pgvector` · `pinecone` · `qdrant` · `weaviate` · `zilliz`

---

## 💬 Chat System

| What | Path |
|------|------|
| **Chat handler (normal)** | `server/utils/chats/index.js` |
| **Chat streaming** | `server/utils/chats/stream.js` |
| **Chat handler (API)** | `server/utils/chats/apiChatHandler.js` |
| **Agent chat handler** | `server/utils/chats/agents.js` |
| **Embed chat handler** | `server/utils/chats/embed.js` |
| **OpenAI-compatible chat** | `server/utils/chats/openaiCompatible.js` |
| **Chat commands** | `server/utils/chats/commands/` |
| **Chat endpoint** | `server/endpoints/chat.js` |
| **Chat model (DB)** | `server/models/workspaceChats.js` |
| **Frontend — Chat container** | `frontend/src/components/WorkspaceChat/` (47 sub-components) |
| **Frontend — Chat settings page** | `frontend/src/pages/WorkspaceSettings/ChatSettings/` |
| **Prompt history model** | `server/models/promptHistory.js` |
| **Slash command presets** | `server/models/slashCommandsPresets.js` |

---

## ⚙️ Agent Flows (Visual Flow Builder)

| What | Path |
|------|------|
| **Flow engine / executor** | `server/utils/agentFlows/` — `index.js`, `executor.js`, `flowTypes.js` |
| **Flow executors** | `server/utils/agentFlows/executors/` |
| **Flow API endpoint** | `server/endpoints/agentFlows.js` |
| **Frontend — Flow builder page** | `frontend/src/pages/Admin/AgentBuilder/` — `index.jsx`, nodes, menus |
| **Frontend — Flow API client** | `frontend/src/models/agentFlows.js` |

---

## 🏢 Workspaces

| What | Path |
|------|------|
| **Workspace API endpoints** | `server/endpoints/workspaces.js` |
| **Workspace threads endpoint** | `server/endpoints/workspaceThreads.js` |
| **Workspace model (DB)** | `server/models/workspace.js` |
| **Workspace thread model** | `server/models/workspaceThread.js` |
| **Workspace users model** | `server/models/workspaceUsers.js` |
| **Suggested messages** | `server/models/workspacesSuggestedMessages.js` |
| **Frontend — Workspace settings page** | `frontend/src/pages/WorkspaceSettings/` |
| **Frontend — Workspace API client** | `frontend/src/models/workspace.js` |
| **Frontend — Sidebar (workspace list)** | `frontend/src/components/Sidebar/` |

---

## 👤 Users, Auth & Invitations

| What | Path |
|------|------|
| **User model** | `server/models/user.js` |
| **Invite model** | `server/models/invite.js` |
| **Invite endpoint** | `server/endpoints/invite.js` |
| **Password recovery** | `server/models/passwordRecovery.js` / `server/utils/PasswordRecovery/` |
| **Auth middleware** | `server/utils/middleware/` (11 files) |
| **Frontend — Login page** | `frontend/src/pages/Login/` |
| **Frontend — Auth context** | `frontend/src/AuthContext.jsx` |
| **Frontend — Invite page** | `frontend/src/pages/Invite/` |
| **Frontend — User management page** | `frontend/src/pages/Admin/Users/` |
| **Frontend — Invitations page** | `frontend/src/pages/Admin/Invitations/` |

---

## 🔑 API Keys

| What | Path |
|------|------|
| **API keys model** | `server/models/apiKeys.js` |
| **API endpoints** | `server/endpoints/api/` — admin, auth, document, embed, openai, system, workspace, user management |
| **Frontend — API keys page** | `frontend/src/pages/GeneralSettings/ApiKeys/` |

---

## 🎨 Appearance & UI Settings

| What | Path |
|------|------|
| **Frontend — Branding settings** | `frontend/src/pages/GeneralSettings/Settings/Branding/` |
| **Frontend — Chat settings** | `frontend/src/pages/GeneralSettings/Settings/Chat/` |
| **Frontend — Interface settings** | `frontend/src/pages/GeneralSettings/Settings/Interface/` |
| **Frontend — Settings components** | `frontend/src/pages/GeneralSettings/Settings/components/` (15 sub-components) |
| **Frontend — Workspace appearance** | `frontend/src/pages/WorkspaceSettings/GeneralAppearance/` |
| **Frontend — Appearance API client** | `frontend/src/models/appearance.js` |
| **Frontend — Logo context** | `frontend/src/LogoContext.jsx` |
| **Frontend — Theme context** | `frontend/src/ThemeContext.jsx` |
| **Frontend — Global CSS** | `frontend/src/index.css` |

---

## 🗣️ Text-to-Speech & Speech-to-Text

| What | Path |
|------|------|
| **TTS providers (backend)** | `server/utils/TextToSpeech/` — `elevenLabs`, `openAi`, `openAiGeneric` |
| **Frontend — TTS components** | `frontend/src/components/TextToSpeech/` |
| **Frontend — STT components** | `frontend/src/components/SpeechToText/` |
| **Frontend — Audio preference page** | `frontend/src/pages/GeneralSettings/AudioPreference/` |
| **Frontend — Transcription preference** | `frontend/src/pages/GeneralSettings/TranscriptionPreference/` |
| **Frontend — Transcription selection** | `frontend/src/components/TranscriptionSelection/` |

---

## 📄 Document Management & Collector

| What | Path |
|------|------|
| **Collector service (main)** | `collector/index.js` |
| **Process single file** | `collector/processSingleFile/` (11 handlers) |
| **Process links** | `collector/processLink/` |
| **Process raw text** | `collector/processRawText/` |
| **Collector extensions** | `collector/extensions/` |
| **Collector utils** | `collector/utils/` (32 files) |
| **Document endpoint (server)** | `server/endpoints/document.js` |
| **Document model** | `server/models/documents.js` |
| **Document sync queue** | `server/models/documentSyncQueue.js` |
| **Document manager (backend)** | `server/utils/DocumentManager/` |
| **Parsed files endpoint** | `server/endpoints/workspacesParsedFiles.js` |
| **Parsed files model** | `server/models/workspaceParsedFiles.js` |
| **Frontend — Data connector components** | `frontend/src/components/DataConnectorOption/` |
| **Frontend — Data connector API client** | `frontend/src/models/dataConnector.js` |

---

## 🔐 System Settings & Security

| What | Path |
|------|------|
| **System settings model** | `server/models/systemSettings.js` |
| **System endpoint** | `server/endpoints/system.js` |
| **Admin endpoint** | `server/endpoints/admin.js` |
| **Encryption manager** | `server/utils/EncryptionManager/` |
| **Frontend — Security page** | `frontend/src/pages/GeneralSettings/Security/` |
| **Frontend — Privacy page** | `frontend/src/pages/GeneralSettings/PrivacyAndData/` |
| **Frontend — System API client** | `frontend/src/models/system.js` |
| **Frontend — Admin API client** | `frontend/src/models/admin.js` |

---

## 🌐 Embed Widget & Chat Embed

| What | Path |
|------|------|
| **Embed widget source** | `embed/` |
| **Embed management endpoint** | `server/endpoints/embedManagement.js` |
| **Embed endpoint** | `server/endpoints/embed/` |
| **Embed config model** | `server/models/embedConfig.js` |
| **Embed chats model** | `server/models/embedChats.js` |
| **Frontend — Embed widgets page** | `frontend/src/pages/GeneralSettings/ChatEmbedWidgets/` |
| **Frontend — Embed API client** | `frontend/src/models/embed.js` |

---

## 📊 Logging, Telemetry & Event Logs

| What | Path |
|------|------|
| **Event logs model** | `server/models/eventLogs.js` |
| **Telemetry** | `server/models/telemetry.js` / `server/utils/telemetry/` |
| **Logger** | `server/utils/logger/` |
| **Frontend — Logging page** | `frontend/src/pages/Admin/Logging/` |

---

## 🧪 Experimental Features

| What | Path |
|------|------|
| **Backend experimental endpoints** | `server/endpoints/experimental/` |
| **Frontend — Experimental features page** | `frontend/src/pages/Admin/ExperimentalFeatures/` |
| **Frontend — Experimental API client** | `frontend/src/models/experimental/` |

---

## 📱 Mobile & Browser Extension

| What | Path |
|------|------|
| **Mobile endpoints** | `server/endpoints/mobile/` |
| **Mobile device model** | `server/models/mobileDevice.js` |
| **Frontend — Mobile connections page** | `frontend/src/pages/GeneralSettings/MobileConnections/` |
| **Frontend — Mobile API client** | `frontend/src/models/mobile.js` |
| **Browser extension endpoint** | `server/endpoints/browserExtension.js` |
| **Browser extension API key model** | `server/models/browserExtensionApiKey.js` |
| **Browser extension source** | `browser-extension/` |
| **Frontend — Browser extension page** | `frontend/src/pages/GeneralSettings/BrowserExtensionApiKey/` |

---

## 🗃️ Database & Migrations

| What | Path |
|------|------|
| **Prisma schema** | `server/prisma/schema.prisma` |
| **Prisma migrations** | `server/prisma/migrations/` (34 migrations) |
| **Prisma seed** | `server/prisma/seed.js` |
| **Database utils** | `server/utils/database/` |

---

## 🎯 Community Hub

| What | Path |
|------|------|
| **Hub endpoint** | `server/endpoints/communityHub.js` |
| **Hub model** | `server/models/communityHub.js` |
| **Frontend — Hub page** | `frontend/src/pages/GeneralSettings/CommunityHub/` |
| **Frontend — Hub components** | `frontend/src/components/CommunityHub/` |
| **Frontend — Hub API client** | `frontend/src/models/communityHub.js` |

---

## 🔀 Routing & Navigation

| What | Path |
|------|------|
| **Frontend — App routes** | `frontend/src/App.jsx` |
| **Frontend — Main router** | `frontend/src/main.jsx` |
| **Frontend — Settings sidebar** | `frontend/src/components/SettingsSidebar/index.jsx` |
| **Frontend — Main sidebar** | `frontend/src/components/Sidebar/index.jsx` |
| **Frontend — Home page** | `frontend/src/pages/Main/Home/index.jsx` |
| **Backend — Server entry point** | `server/index.js` |
| **ENV config (.env)** | `server/.env.example` / `docker/.env.example` |

---

## 🐳 Docker & Deployment

| What | Path |
|------|------|
| **Dockerfile** | `docker/Dockerfile` |
| **docker-compose.yml** | `docker/docker-compose.yml` |
| **Docker env config** | `docker/.env` / `docker/.env.example` |
| **Docker entrypoint script** | `docker/docker-entrypoint.sh` |
| **Cloud deployment templates** | `cloud-deployments/` (25 files) |

---

## 🌍 Internationalization (i18n)

| What | Path |
|------|------|
| **Frontend locale files** | `frontend/src/locales/` (25 language folders) |
| **i18n config** | `frontend/src/i18n.js` |
| **Root-level locales** | `locales/` |

---

## 📝 System Prompt & Variables

| What | Path |
|------|------|
| **System prompt variables model** | `server/models/systemPromptVariables.js` |
| **Default system prompt page** | `frontend/src/pages/Admin/DefaultSystemPrompt/` |
| **System prompt variables page** | `frontend/src/pages/Admin/SystemPromptVariables/` |
| **Frontend API client** | `frontend/src/models/systemPromptVariable.js` |

---

## 🔍 Quick Reference — "I want to edit X"

| I want to edit... | Start here |
|-------------------|-----------|
| **Agent skills / tools** | `server/utils/agents/aibitat/plugins/` |
| **Agent LLM provider used by agents** | `server/utils/agents/aibitat/providers/` |
| **MCP server config** | `server/utils/MCP/index.js` + `server/endpoints/mcpServers.js` |
| **LLM provider (add/modify)** | `server/utils/AiProviders/<provider>/` + `frontend/src/components/LLMSelection/` |
| **Embedding provider** | `server/utils/EmbeddingEngines/<provider>/` + `frontend/src/components/EmbeddingSelection/` |
| **Vector database provider** | `server/utils/vectorDbProviders/<provider>/` + `frontend/src/components/VectorDBSelection/` |
| **Chat behaviour** | `server/utils/chats/` |
| **Document ingestion** | `collector/` |
| **UI branding / appearance** | `frontend/src/pages/GeneralSettings/Settings/Branding/` + `frontend/src/index.css` |
| **Sidebar** | `frontend/src/components/Sidebar/` |
| **Settings sidebar (navigation)** | `frontend/src/components/SettingsSidebar/index.jsx` |
| **Docker deployment** | `docker/` |
| **Database schema** | `server/prisma/schema.prisma` |
| **Environment variables** | `server/.env.example` / `docker/.env.example` |
| **Translations** | `frontend/src/locales/` |
