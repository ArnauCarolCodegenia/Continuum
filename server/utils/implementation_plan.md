
# implementation_plan.md

## Objective

Create a custom AnythingLLM agent skill that acts as a read-only database viewer for PostgreSQL and MySQL databases connected to the system.

The agent should allow users to:

- List database tables
- Inspect table schemas
- Run safe read-only SQL queries
- Quickly explore connected databases through natural language

The solution will be implemented as a custom AnythingLLM Agent Skill using the Node.js runtime described in the developer documentation:

https://docs.anythingllm.com/agent/custom/developer-guide

The agent must support multiple database engines using a Strategy Pattern, allowing runtime selection between PostgreSQL and MySQL.

---

# Architecture

## Overview

The custom skill will:

- Run inside the AnythingLLM agent environment (Node.js runtime)
- Use native database drivers:
  - pg for PostgreSQL
  - mysql2 for MySQL
- Dynamically select the driver depending on the configuration (DB_TYPE)
- Provide a safe read-only interface

Supported actions:

| Action | Description |
|------|------|
| list_tables | Returns all tables in the database |
| get_schema | Returns column structure for a table |
| query | Executes read-only SELECT queries |

---

# Folder Structure

The skill will be created inside the AnythingLLM plugins directory:

plugins/
└── agent-skills/
    └── multi-db-viewer/
        ├── plugin.json
        ├── handler.js
        ├── package.json
        └── node_modules/

---

# Implementation Steps

## Phase 1 — Environment Preparation

### Locate plugin directory

Find the AnythingLLM plugin directory:

plugins/agent-skills

This can be confirmed from:

AnythingLLM → Settings → Agent Skills

---

## Phase 2 — Create Skill Scaffold

Create the plugin folder.

mkdir plugins/agent-skills/multi-db-viewer
cd plugins/agent-skills/multi-db-viewer

Initialize a Node project:

npm init -y

---

## Phase 3 — Install Database Drivers

Install the required drivers:

npm install pg mysql2

Dependencies used:

| Package | Purpose |
|------|------|
| pg | PostgreSQL client |
| mysql2 | MySQL driver with promise support |

---

# Plugin Manifest

Create plugin.json.

{
  "schema": "skill-1.0.0",
  "version": "1.1.0",
  "name": "Enterprise DB Viewer",
  "hubId": "multi-db-viewer",
  "description": "Read-only viewer for PostgreSQL and MySQL databases.",
  "author": "ExpertDev",
  "setup_args": {
    "DB_TYPE": {
      "type": "string",
      "required": true,
      "input": {
        "type": "select",
        "options": ["postgres", "mysql"],
        "default": "postgres"
      }
    },
    "CONNECTION_STRING": {
      "type": "string",
      "required": true,
      "input": {
        "type": "password",
        "placeholder": "postgres://user:pass@host:5432/dbname"
      }
    }
  },
  "examples": [
    {
      "prompt": "List all tables in the database",
      "call": "{\"action\": \"list_tables\"}"
    },
    {
      "prompt": "Describe the columns in the 'orders' table",
      "call": "{\"action\": \"get_schema\", \"table\": \"orders\"}"
    }
  ]
}

### Configuration Parameters

| Parameter | Description |
|------|------|
| DB_TYPE | Database engine (postgres/mysql) |
| CONNECTION_STRING | Full connection URI |

Example connection strings:

postgres://user:password@host:5432/dbname

mysql://user:password@host:3306/dbname

---

# Skill Runtime Logic

Create handler.js.

const { Client } = require('pg');
const mysql = require('mysql2/promise');

module.exports.runtime = {
  handler: async function ({ action, table, query }, runtimeArgs) {
    const { DB_TYPE, CONNECTION_STRING } = runtimeArgs;
    
    try {
      if (DB_TYPE === 'postgres') {
        return await handlePostgres(CONNECTION_STRING, action, table, query);
      } else {
        return await handleMySQL(CONNECTION_STRING, action, table, query);
      }
    } catch (err) {
      return `Database Error: ${err.message}`;
    }
  }
};

async function handlePostgres(url, action, table, query) {
  const client = new Client({ connectionString: url });
  await client.connect();

  try {

    if (action === "list_tables") {
      const res = await client.query(
        "SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema'"
      );

      return `Postgres Tables: ` + res.rows.map(r => r.tablename).join(", ");
    }

    if (action === "get_schema") {
      const res = await client.query(
        "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = $1",
        [table]
      );

      return `Schema for ${table}: ` + res.rows
        .map(r => `${r.column_name} (${r.data_type})`)
        .join(", ");
    }

    if (query && !query.toLowerCase().trim().startsWith("select"))
      return "Error: Only SELECT allowed.";

    const res = await client.query(query);

    return JSON.stringify(res.rows.slice(0, 5));

  } finally {
    await client.end();
  }
}

async function handleMySQL(url, action, table, query) {
  const connection = await mysql.createConnection(url);

  try {

    if (action === "list_tables") {
      const [rows] = await connection.execute("SHOW TABLES");

      return `MySQL Tables: ` + rows.map(r => Object.values(r)[0]).join(", ");
    }

    if (action === "get_schema") {
      const [rows] = await connection.execute(`DESCRIBE ${table}`);

      return `Schema for ${table}: ` + rows
        .map(r => `${r.Field} (${r.Type})`)
        .join(", ");
    }

    if (query && !query.toLowerCase().trim().startsWith("select"))
      return "Error: Only SELECT allowed.";

    const [rows] = await connection.execute(query);

    return JSON.stringify(rows.slice(0, 5));

  } finally {
    await connection.end();
  }
}

---

# Agent Usage Examples

Example prompts:

@agent list the tables in the database

@agent describe the columns in the users table

@agent run this query:
SELECT * FROM orders LIMIT 5

---

# Configuration in AnythingLLM

1. Open:

AnythingLLM → Settings → Agent Skills

2. Enable:

Enterprise DB Viewer

3. Provide:

- DB_TYPE
- CONNECTION_STRING

---

# Security Considerations

## Read-Only Access

The database user must have SELECT permissions only.

Example PostgreSQL setup:

CREATE USER readonly_user WITH PASSWORD 'secure_password';

GRANT CONNECT ON DATABASE mydb TO readonly_user;
GRANT USAGE ON SCHEMA public TO readonly_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_user;

---

## Query Safety

The agent enforces SELECT-only queries.

Any query starting with:

INSERT
UPDATE
DELETE
DROP
ALTER

will be rejected.

---

# Testing

## Test 1 — Connection

Prompt:

@agent list tables

Expected:

Postgres Tables: users, orders, invoices

---

## Test 2 — Schema Inspection

Prompt:

@agent describe the orders table

Expected:

Schema for orders: id (integer), total (numeric), created_at (timestamp)

---

## Test 3 — Query Execution

Prompt:

@agent run this query:
SELECT * FROM users LIMIT 5

Expected:

JSON output of rows

---

# Future Improvements

Potential enhancements:

- Add SQLite support
- Add table preview
- Add pagination
- Add row counting
- Add schema graph generation
- Add automatic database discovery
- Add CSV export
- Add visual schema explorer
