import { prisma } from "../config/prisma.js";
import type { CreateTransaction } from "../types/transaction-types.js";

export async function getTransactions(month?: string) {
  let where = {};
  if (month && /^\d{4}-\d{2}$/.test(month)) {
    const [year, monthPart] = month.split("-").map(Number);
    const startDate = new Date(year!, monthPart! - 1, 1);
    const endDate = new Date(year!, monthPart!, 1);
    where = {
      date: {
        gte: startDate,
        lt: endDate,
      },
    };
  }

  return await prisma.transaction.findMany({
    where: where,
  });
}

export async function saveTransaction(transactionData: CreateTransaction) {
  return await prisma.transaction.create({
    data: {
      type: transactionData.type,
      optional: transactionData.optional,
      value: transactionData.value,
      description: transactionData.description || null,
      inCash: transactionData.inCash,
      months: transactionData.months || null,
      date: new Date(transactionData.date),
      userId: transactionData.userId,
    },
  });
}
