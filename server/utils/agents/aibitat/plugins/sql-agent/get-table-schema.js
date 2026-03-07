module.exports.SqlAgentGetTableSchema = {
  name: "sql-get-table-schema",
  plugin: function () {
    const {
      listSQLConnections,
      getDBClient,
    } = require("./SQLConnectors/index.js");

    return {
      name: "sql-get-table-schema",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Gets the table schema in SQL for a given `table` and `database_id`",
          examples: [
            {
              prompt: "¿Cómo es la tabla de facturas en mi base de datos del espacio de trabajo?",
              call: JSON.stringify({
                database_id: "pg_facturas_db",
                table_name: "facturas",
              }),
            },
            {
              prompt:
                "Obtén el esquema de la tabla de usuarios en la base de datos de producción",
              call: JSON.stringify({
                database_id: "production",
                table_name: "usuarios",
              }),
            },
            {
              prompt:
                "Muestra las columnas de la tabla clientes",
              call: JSON.stringify({
                database_id: "pg_facturas_db",
                table_name: "clientes",
              }),
            },
          ],
          // JSON schema defining the arguments the LLM must provide to call this tool
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              database_id: {
                type: "string",
                description:
                  "The database identifier for which we will connect to to query the table schema. This is a required field.",
              },
              table_name: {
                type: "string",
                description:
                  "The database identifier for the table name we want the schema for. This is a required field.",
              },
            },
            additionalProperties: false,
          },
          required: ["database_id", "table_name"],
          handler: async function ({ database_id = "", table_name = "" }) {
            this.super.handlerProps.log(`Using the sql-get-table-schema tool.`);
            try {
              const databaseConfig = (await listSQLConnections()).find(
                (db) => db.database_id === database_id
              );
              if (!databaseConfig) {
                this.super.handlerProps.log(
                  `sql-get-table-schema failed to find config!`,
                  database_id
                );
                return `No database connection for ${database_id} was found!`;
              }

              const db = getDBClient(databaseConfig.engine, databaseConfig);
              this.super.introspect(
                `${this.caller}: Querying the table schema for ${table_name} in the ${databaseConfig.database_id} database.`
              );
              this.super.introspect(
                `Running SQL: ${db.getTableSchemaSql(table_name)}`
              );
              const result = await db.runQuery(
                db.getTableSchemaSql(table_name)
              );

              if (result.error) {
                this.super.handlerProps.log(
                  `sql-get-table-schema tool reported error`,
                  result.error
                );
                this.super.introspect(`Error: ${result.error}`);
                return `There was an error running the query: ${result.error}`;
              }

              return JSON.stringify(result);
            } catch (e) {
              this.super.handlerProps.log(
                `sql-get-table-schema raised an error. ${e.message}`
              );
              return e.message;
            }
          },
        });
      },
    };
  },
};
