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
            "Run a read-only SQL query on a `database_id` which will return up rows of data related to the query. The query must only be SELECT statements which do not modify the table data. There should be a reasonable LIMIT on the return quantity to prevent long-running or queries which crash the db.",
          examples: [
            {
              prompt: "How many customers are in dvd-rentals?",
              call: JSON.stringify({
                database_id: "dvd-rentals",
                sql_query: "SELECT * FROM customers",
              }),
            },
            {
              prompt: "Can you tell me the total volume of sales last month?",
              call: JSON.stringify({
                database_id: "sales-db",
                sql_query:
                  "SELECT SUM(sale_amount) AS total_sales FROM sales WHERE sale_date >= DATEADD(month, -1, DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1)) AND sale_date < DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1)",
              }),
            },
            {
              prompt:
                "Do we have anyone in the staff table for our production db named 'sam'? ",
              call: JSON.stringify({
                database_id: "production",
                sql_query:
                  "SElECT * FROM staff WHERE first_name='sam%' OR last_name='sam%'",
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
