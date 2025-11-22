import { createTool } from "@mastra/core";
import { z } from "zod";
import { prisma } from "../../config/prisma.js";

export const getUserProfile = createTool({
  id: "user-profile",
  description:
    "Busca o nome, idade, renda mensal e dinheiro guardado do usuário. Valores monetários estão em centavos.",
  inputSchema: z.object({
    userId: z.string().describe("O ID do usuário logado"),
  }),
  execute: async ({ context }) => {
    const user = await prisma.user.findUnique({
      where: { id: context.userId },
      select: { name: true, age: true, income: true, money_saved: true },
    });
    return user;
  },
});

export const getUserGoals = createTool({
  id: "user-goals",
  description:
    "Busca a lista de objetivos financeiros do usuário, incluindo prazo e valor alvo.",
  inputSchema: z.object({
    userId: z.string().describe("O ID do usuário logado"),
  }),
  execute: async ({ context }) => {
    const goals = await prisma.goal.findMany({
      where: { userId: context.userId },
    });
    return goals;
  },
});

export const getRecentTransactions = createTool({
  id: "recent-transactions",
  description:
    "Busca as transações dos últimos 30 dias para analisar o fluxo de caixa.",
  inputSchema: z.object({
    userId: z.string().describe("O ID do usuário logado"),
  }),
  execute: async ({ context }) => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: context.userId,
        date: { gte: thirtyDaysAgo },
      },
      orderBy: { date: "desc" },
    });
    return transactions;
  },
});
