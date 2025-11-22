import { Mastra } from "@mastra/core";
import { financialAgent } from "./agents/financialAgent.js";
import { LibSQLStore } from "@mastra/libsql";

export const mastra = new Mastra({
  agents: { financialAgent },
  storage: new LibSQLStore({
    url: ":memory:",
  }),
});
