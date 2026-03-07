module.exports.SqlAgentQuery = {
  name: "sql-query",
  plugin: function () {
    const {
      getDBClient,
      listSQLConnections,
    } = require("./SQLConnectors/index.js");

    return {
      name: "sql-query",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Run a read-only SQL query on a `database_id` which will return rows of data related to the query. The query must only be SELECT statements which do not modify the table data. There should be a reasonable LIMIT on the return quantity to prevent long-running queries. IMPORTANT: Before running any query, you MUST first use `sql-list-tables` and `sql-get-table-schema` to discover the actual table and column names. NEVER guess or assume column names — always check the schema first. If a query returns an error about a missing column or table, use the schema tools to find the correct names and retry.",
          examples: [
            {
              prompt: "¿Cuántas facturas hay en total?",
              call: JSON.stringify({
                database_id: "pg_facturas_db",
                sql_query: "SELECT COUNT(*) FROM facturas",
              }),
            },
            {
              prompt: "¿Me puedes decir el volumen total de ventas del mes pasado?",
              call: JSON.stringify({
                database_id: "sales-db",
                sql_query:
                  "SELECT SUM(sale_amount) AS total_sales FROM sales WHERE sale_date >= (CURRENT_DATE - INTERVAL '1 month')",
              }),
            },
            {
              prompt:
                "¿Tenemos algún huésped en la tabla de facturas que se llame 'sam'?",
              call: JSON.stringify({
                database_id: "pg_facturas_db",
                sql_query:
                  "SELECT * FROM facturas WHERE nombre_usuario ILIKE '%sam%'",
              }),
            },
            {
              prompt:
                "Dime cuáles son las 5 ciudades con más facturas registradas",
              call: JSON.stringify({
                database_id: "pg_facturas_db",
                sql_query:
                  "SELECT ciudad, COUNT(*) as cantidad FROM facturas GROUP BY ciudad ORDER BY cantidad DESC LIMIT 5",
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
                  "The database identifier for which we will connect to to query the table schema. This is required to run the SQL query.",
              },
              sql_query: {
                type: "string",
                description:
                  "The raw SQL query to run. Should be a query which does not modify the table and will return results.",
              },
            },
            additionalProperties: false,
          },
          required: ["database_id", "sql_query"],
          //required: ["database_id", "table_name"],
          handler: async function ({ database_id = "", sql_query = "" }) {
            this.super.handlerProps.log(`Using the sql-query tool.`);
            try {
              const databaseConfig = (await listSQLConnections()).find(
                (db) => db.database_id === database_id
              );
              if (!databaseConfig) {
                this.super.handlerProps.log(
                  `sql-query failed to find config!`,
                  database_id
                );
                return `No database connection for ${database_id} was found!`;
              }

              this.super.introspect(
                `${this.caller}: Im going to run a query on the ${database_id} to get an answer.`
              );
              const db = getDBClient(databaseConfig.engine, databaseConfig);

              this.super.introspect(`Running SQL: ${sql_query}`);
              
              // Prevent common mutating commands natively
              const isMutatingQuery = /^\s*(INSERT|UPDATE|DELETE|DROP|ALTER|TRUNCATE|GRANT|REVOKE|COMMIT|ROLLBACK|REPLACE|UPSERT)\b/i.test(sql_query);
              if (isMutatingQuery) {
                this.super.handlerProps.log(`sql-query tool rejected mutating query`);
                return `Error: The query was rejected because mutating operations (INSERT, UPDATE, DELETE, etc.) are strictly prohibited. You may only run SELECT queries.`;
              }

              const result = await db.runQuery(sql_query);
              if (result.error) {
                this.super.handlerProps.log(
                  `sql-query tool reported error`,
                  result.error
                );
                this.super.introspect(`Error: ${result.error}`);
                // Guide the LLM to check schema when column/table errors occur
                const lowerErr = result.error.toLowerCase();
                if (lowerErr.includes("column") || lowerErr.includes("does not exist") || lowerErr.includes("unknown") || lowerErr.includes("no such") || lowerErr.includes("invalid column")) {
                  return `Query error: ${result.error}. IMPORTANT: You likely used incorrect column or table names. Use sql-get-table-schema to check the actual column names for this table, then retry with the correct names.`;
                }
                return `There was an error running the query: ${result.error}`;
              }

              // Guard against massive payloads crashing the LLM context (hard limit of 100 rows)
              const MAX_ROWS = 500;
              const originalCount = result.rows?.length || 0;
              if (originalCount > MAX_ROWS) {
                result.rows = result.rows.slice(0, MAX_ROWS);
                result.warning = `Results were truncated. Showing ${MAX_ROWS} of ${originalCount} rows to prevent context length overflow. Please use LIMIT/OFFSET or more specific filtering if you need other data.`;
                this.super.introspect(result.warning);
              }

              return JSON.stringify(result);
            } catch (e) {
              console.error(e);
              return e.message;
            }
          },
        });
      },
    };
  },
};
