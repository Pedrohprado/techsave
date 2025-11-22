import { Mastra } from "@mastra/core";
import { financialAgent } from "./agents/financialAgent.js";
import { PostgresStore } from "@mastra/pg";

// Use Postgres para persistência de memória
const databaseUrl =
  process.env.DATABASE_URL || "postgresql://localhost/techsave";

export const mastra = new Mastra({
  agents: { financialAgent },
  storage: new PostgresStore({
    connectionString: databaseUrl,
  }),
});
