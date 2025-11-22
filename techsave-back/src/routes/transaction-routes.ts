import type { FastifyInstance } from "fastify";
import {
  createTransaction,
  listTransactions,
} from "../controllers/transaction-controllers.js";

export function transactionRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/",
    {
      schema: {
        tags: ["Transaction"],
        description: "List all transactions",
        querystring: {
          type: "object",
          properties: {
            month: {
              type: "string",
              description: "Month filter in YYYY-MM format",
            },
          },
        },
        response: {
          500: {
            description: "Internal Server Error",
            type: "object",
            properties: {
              message: { type: "string" },
              error: { type: "string" },
            },
          },
          200: {
            description: "Successful Response",
            type: "array",
            items: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                },
                type: {
                  type: "string",
                },
                optional: {
                  type: "boolean",
                },
                value: {
                  type: "integer",
                },
                description: {
                  type: "string",
                },
                inCash: {
                  type: "boolean",
                },
                months: {
                  type: "integer",
                },
                date: {
                  type: "string",
                },
                createdAt: {
                  type: "string",
                },
                userId: {
                  type: "string",
                },
              },
            },
          },
        },
      },
    },
    listTransactions
  );

  fastify.post(
    "/",
    {
      schema: {
        tags: ["Transaction"],
        description: "Create a new transaction",
        body: {
          type: "object",
          properties: {
            type: { type: "string", enum: ["INCOME", "EXPENSE"] },
            optional: { type: "boolean" },
            value: { type: "number" },
            description: { type: "string" },
            inCash: { type: "boolean" },
            months: { type: "number" },
            date: { type: "string" },
            userId: { type: "string" },
          },
        },
        response: {
          500: {
            description: "Internal Server Error",
            type: "object",
            properties: {
              message: { type: "string" },
              error: { type: "string" },
            },
          },
          400: {
            description: "Bad Request",
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
          200: {
            description: "Successful Response",
            type: "object",
            properties: {
              message: { type: "string" },
              newTransaction: {
                type: "object",
                properties: {
                  id: {
                    type: "string",
                  },
                  type: {
                    type: "string",
                  },
                  optional: {
                    type: "boolean",
                  },
                  value: {
                    type: "integer",
                  },
                  description: {
                    type: "string",
                  },
                  inCash: {
                    type: "boolean",
                  },
                  months: {
                    type: "integer",
                  },
                  date: {
                    type: "string",
                  },
                  createdAt: {
                    type: "string",
                  },
                  userId: {
                    type: "string",
                  },
                },
              },
            },
          },
        },
      },
    },
    createTransaction
  );
}
