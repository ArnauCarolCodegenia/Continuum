module.exports.SqlAgentListDatabase = {
  name: "sql-list-databases",
  plugin: function () {
    const { listSQLConnections } = require("./SQLConnectors");
    return {
      name: "sql-list-databases",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "List all available databases via `list_databases` you currently have access to. Returns a unique string identifier `database_id` that can be used for future calls. Each database may also include a `context` object with a description, table details, and example queries — use this context to write better SQL queries. You should ALWAYS call this tool first when working with SQL to know which databases are available.",
          examples: [
            {
              prompt: "What databases can you access?",
              call: JSON.stringify({}),
            },
            {
              prompt: "What databases can you tell me about?",
              call: JSON.stringify({}),
            },
            {
              prompt: "Is there a database named erp-logs you can access?",
              call: JSON.stringify({}),
            },
          ],
          // JSON schema defining the arguments the LLM must provide to call this tool
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {},
            additionalProperties: false,
          },
          handler: async function () {
            this.super.handlerProps.log(`Using the sql-list-databases tool.`);
            this.super.introspect(
              `${this.caller}: Checking what are the available databases.`
            );

            const connections = (await listSQLConnections()).map((conn) => {
              const { connectionString, ...rest } = conn;
              return rest; // includes engine, database_id, and context if present
            });
            return JSON.stringify(connections);
          },
        });
      },
    };
  },
};
