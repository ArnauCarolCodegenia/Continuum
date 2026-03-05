import PostgreSQLLogo from "./icons/postgresql.png";
import MySQLLogo from "./icons/mysql.png";
import MSSQLLogo from "./icons/mssql.png";
import { X, Info } from "@phosphor-icons/react";
import { useState } from "react";

export const DB_LOGOS = {
  postgresql: PostgreSQLLogo,
  mysql: MySQLLogo,
  "sql-server": MSSQLLogo,
};

export default function DBConnection({ connection, onRemove, onContextEdit }) {
  const { database_id, engine, context } = connection;
  const [showContext, setShowContext] = useState(false);

  function removeConfirmation() {
    if (
      !window.confirm(
        `Delete ${database_id} from the list of available SQL connections? This cannot be undone.`
      )
    )
      return false;
    onRemove(database_id);
  }

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex gap-x-4 items-center">
        <img
          src={DB_LOGOS?.[engine] ?? null}
          alt={`${engine} logo`}
          className="w-10 h-10 rounded-md"
        />
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col">
            <div className="text-sm font-semibold text-white">{database_id}</div>
            <div className="mt-1 text-xs text-description">{engine}</div>
          </div>
          <div className="flex items-center gap-x-2">
            <button
              type="button"
              onClick={() => setShowContext((prev) => !prev)}
              title="Add/edit context for this database"
              className={`border-none transition-colors ${
                context
                  ? "text-blue-400 hover:text-blue-300"
                  : "text-white/40 hover:text-white"
              }`}
            >
              <Info size={20} />
            </button>
            <button
              type="button"
              onClick={removeConfirmation}
              className="border-none text-white hover:text-red-500"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      </div>

      {showContext && (
        <DBContextEditor
          database_id={database_id}
          context={context}
          onSave={(newContext) => {
            onContextEdit(database_id, newContext);
            setShowContext(false);
          }}
          onCancel={() => setShowContext(false)}
        />
      )}
    </div>
  );
}

/**
 * Inline editor for per-DB context. The user can either type JSON directly
 * or upload a .json file. The shape is free-form, but the recommended structure is:
 * { "description": "...", "tables": {...}, "example_queries": ["..."] }
 */
function DBContextEditor({ database_id, context, onSave, onCancel }) {
  const [raw, setRaw] = useState(
    context ? JSON.stringify(context, null, 2) : ""
  );
  const [error, setError] = useState(null);

  function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target.result;
      try {
        JSON.parse(text); // validate
        setRaw(text);
        setError(null);
      } catch {
        setError("Invalid JSON file. Please upload a valid .json file.");
      }
    };
    reader.readAsText(file);
  }

  function handleSave() {
    if (!raw.trim()) {
      onSave(null); // remove context
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      onSave(parsed);
      setError(null);
    } catch {
      setError("Invalid JSON. Please fix the errors before saving.");
    }
  }

  return (
    <div className="ml-14 p-4 bg-theme-bg-primary rounded-lg border border-white/10 flex flex-col gap-y-3">
      <div className="flex items-center justify-between">
        <p className="text-white text-sm font-medium">
          Context for <span className="text-blue-400">{database_id}</span>
        </p>
        <label className="text-xs text-white/50 cursor-pointer hover:text-white/80 transition-colors">
          Upload .json
          <input
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>
      </div>

      <p className="text-white/50 text-xs">
        Provide context the SQL agent will use to write better queries.
        Recommended shape:{" "}
        <code className="text-blue-300 text-xs">
          {`{ "description": "...", "tables": { "orders": "..." }, "example_queries": ["SELECT ..."] }`}
        </code>
      </p>

      <textarea
        value={raw}
        onChange={(e) => {
          setRaw(e.target.value);
          setError(null);
        }}
        rows={8}
        spellCheck={false}
        placeholder={`{\n  "description": "Main sales database",\n  "tables": {\n    "orders": "Contains customer orders with columns: id, customer_id, amount, created_at"\n  },\n  "example_queries": [\n    "SELECT COUNT(*) FROM orders WHERE created_at > NOW() - INTERVAL '30 days'"\n  ]\n}`}
        className="w-full font-mono text-xs bg-theme-settings-input-bg text-white rounded-lg p-3 border-none focus:outline-primary-button resize-y"
      />

      {error && (
        <p className="text-red-400 text-xs">{error}</p>
      )}

      <div className="flex justify-end gap-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="text-white/60 hover:text-white text-sm px-3 py-1 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-1 rounded-lg transition-colors"
        >
          Save context
        </button>
      </div>
    </div>
  );
}
