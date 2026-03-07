const fs = require('fs');
const path = require('path');

/**
 * Dynamically loads tool examples for the SQL agent by reading JSON files
 * from the SQLConnectors/querys directory.
 * @param {'query' | 'schema'} type The type of examples to generate.
 * @returns {Array<{ prompt: string, call: string }>} Example list.
 */
function getDynamicExamples(type) {
  const querysDir = path.join(__dirname, 'SQLConnectors', 'querys');
  let loadedExamples = [];
  
  if (fs.existsSync(querysDir)) {
    const files = fs.readdirSync(querysDir).filter(f => f.endsWith('.json'));
    
    for (const file of files) {
      try {
        const fileContent = fs.readFileSync(path.join(querysDir, file), 'utf8');
        // Fallback cleanup in case of malformed inputs like "data = { ... }."
        const jsonContent = fileContent.replace(/^data\s*=\s*/, '').replace(/;?\.?$/, '');
        const data = JSON.parse(jsonContent);
        const dbId = data.dataset;
        
        if (!data.qa || !Array.isArray(data.qa)) continue;

        data.qa.forEach(qa => {
          if (type === 'query') {
            loadedExamples.push({
              prompt: qa.pregunta,
              call: JSON.stringify({
                database_id: dbId,
                sql_query: qa.query
              })
            });
          } else if (type === 'schema') {
            // Infer table from query syntax "FROM table_name"
            const match = qa.query.match(/FROM\s+([a-zA-Z0-9_]+)/i);
            if (match) {
              const table_name = match[1];
              // De-duplicate schema examples for the same db and table
              const exists = loadedExamples.find(e => 
                e.call.includes(`"table_name":"${table_name}"`) && 
                e.call.includes(`"database_id":"${dbId}"`)
              );
              
              if (!exists) {
                loadedExamples.push({
                  prompt: `¿Me puedes dar la estructura de la tabla ${table_name} en ${dbId}?`,
                  call: JSON.stringify({
                    database_id: dbId,
                    table_name: table_name
                  })
                });
              }
            }
          }
        });
      } catch (e) {
        console.error("Failed to load examples from", file, e);
      }
    }
  }

  // Fallback defaults if no JSON files are found
  if (loadedExamples.length === 0) {
    if (type === 'query') {
      loadedExamples = [
        {
          prompt: "¿Cuántas facturas hay en total?",
          call: JSON.stringify({
            database_id: "pg_facturas_db",
            sql_query: "SELECT COUNT(*) FROM facturas",
          }),
        }
      ];
    } else {
      loadedExamples = [
        {
          prompt: "¿Cómo es la tabla de facturas en mi base de datos del espacio de trabajo?",
          call: JSON.stringify({
            database_id: "pg_facturas_db",
            table_name: "facturas",
          }),
        }
      ];
    }
  }
  
  return loadedExamples;
}

module.exports = {
  getDynamicExamples
};
