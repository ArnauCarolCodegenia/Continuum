import React, { useEffect, useState } from "react";
import DBConnection from "./DBConnection";
import { Plus, Database } from "@phosphor-icons/react";
import NewSQLConnection from "./NewConnectionModal";
import { useModal } from "@/hooks/useModal";
import SQLAgentImage from "@/media/agents/sql-agent.png";
import Admin from "@/models/admin";

export default function AgentSQLConnectorSelection({
  skill,
  settings, // unused.
  toggleSkill,
  enabled = false,
  setHasChanges,
}) {
  const { isOpen, openModal, closeModal } = useModal();
  const [connections, setConnections] = useState([]);
  const [editingConnection, setEditingConnection] = useState(null);
  useEffect(() => {
    Admin.systemPreferencesByFields(["agent_sql_connections"])
      .then((res) => setConnections(res?.settings?.agent_sql_connections ?? []))
      .catch(() => setConnections([]));
  }, []);

  function handleRemoveConnection(databaseId) {
    setHasChanges(true);
    setConnections((prev) =>
      prev.map((conn) => {
        if (conn.database_id === databaseId)
          return { ...conn, action: "remove" };
        return conn;
      })
    );
  }

  /**
   * Update the per-DB context for a given database_id.
   * Marks the connection as "update" so mergeConnections on the server
   * will include the new context field when it is saved.
   */
  function handleEditConnection(connection) {
    setEditingConnection(connection);
    openModal();
  }

  function handleContextEdit(databaseId, newContext) {
    setHasChanges(true);
    setConnections((prev) =>
      prev.map((conn) => {
        if (conn.database_id !== databaseId) return conn;
        return {
          ...conn,
          context: newContext,
          // Mark as "add" so the server mergeConnections re-includes it
          // with the updated context. We need to pass the connectionString too.
          action: "update-context",
        };
      })
    );
  }

  return (
    <>
      <div className="p-2">
        <div className="flex flex-col gap-y-[18px] max-w-[500px]">
          <div className="flex items-center gap-x-2">
            <Database
              size={24}
              color="var(--theme-text-primary)"
              weight="bold"
            />
            <label
              htmlFor="name"
              className="text-theme-text-primary text-md font-bold"
            >
              SQL Agent
            </label>
            <label className="border-none relative inline-flex items-center ml-auto cursor-pointer">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={enabled}
                onChange={() => toggleSkill(skill)}
              />
              <div className="peer-disabled:opacity-50 pointer-events-none peer h-6 w-11 rounded-full bg-[#CFCFD0] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:shadow-xl after:border-none after:bg-white after:box-shadow-md after:transition-all after:content-[''] peer-checked:bg-[#32D583] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-transparent"></div>
              <span className="ml-3 text-sm font-medium"></span>
            </label>
          </div>
          <img
            src={SQLAgentImage}
            alt="SQL Agent"
            className="w-full rounded-md"
          />
          <p className="text-theme-text-secondary text-opacity-60 text-xs font-medium py-1.5">
            Enable your agent to be able to leverage SQL to answer your
            questions by connecting to various SQL database providers. You can
            also add context and example queries per database to improve
            response quality.
          </p>
          {enabled && (
            <>
              <input
                name="system::agent_sql_connections"
                type="hidden"
                value={JSON.stringify(connections)}
              />
              <input
                type="hidden"
                value={JSON.stringify(
                  connections.filter((conn) => conn.action !== "remove")
                )}
              />
              <div className="flex flex-col mt-2 gap-y-2">
                <p className="text-theme-text-primary font-semibold text-sm">
                  Your database connections
                </p>
                <p className="text-white/40 text-xs">
                  Click the{" "}
                  <span className="text-blue-400 font-medium">ℹ</span> icon on
                  any connection to add context and example queries that help
                  the SQL agent give better answers.
                </p>
                <div className="flex flex-col gap-y-3">
                  {connections
                    .filter((connection) => connection.action !== "remove")
                    .map((connection) => (
                      <DBConnection
                        key={connection.database_id}
                        connection={connection}
                        onRemove={handleRemoveConnection}
                        onContextEdit={handleContextEdit}
                        onEdit={handleEditConnection}
                      />
                    ))}
                  <button
                    type="button"
                    onClick={() => { setEditingConnection(null); openModal(); }}
                    className="w-fit relative flex h-[40px] items-center border-none hover:bg-theme-bg-secondary rounded-lg"
                  >
                    <div className="flex w-full gap-x-2 items-center p-4">
                      <div className="bg-theme-bg-secondary p-2 rounded-lg h-[24px] w-[24px] flex items-center justify-center">
                        <Plus
                          weight="bold"
                          size={14}
                          className="shrink-0 text-theme-text-primary"
                        />
                      </div>
                      <p className="text-left text-theme-text-primary text-sm">
                        New SQL connection
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <NewSQLConnection
        isOpen={isOpen}
        closeModal={() => { setEditingConnection(null); closeModal(); }}
        setHasChanges={setHasChanges}
        existingConnection={editingConnection}
        onSubmit={(newDb) => {
          setHasChanges(true);
          if (editingConnection) {
            setConnections((prev) =>
              prev.map((conn) =>
                conn.database_id === editingConnection.database_id
                  ? { ...conn, ...newDb, action: "add" }
                  : conn
              )
            );
          } else {
            setConnections((prev) => [...prev, { action: "add", ...newDb }]);
          }
          setEditingConnection(null);
        }}
      />
    </>
  );
}
