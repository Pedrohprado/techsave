import type { FastifyReply, FastifyRequest } from "fastify";
import {
  getTransactions,
  saveTransaction,
} from "../services/transaction-services.js";
import type { CreateTransaction } from "../types/transaction-types.js";

export async function listTransactions(
  req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { month } = req.query as { month?: string };

    const transactions = await getTransactions(month);

    return reply.status(200).send({ transactions });
  } catch (error) {
    return reply.status(500).send({
      message: "Erro interno do servidor",
      error,
    });
  }
}

export async function createTransaction(
  req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const transactionData = req.body as CreateTransaction;

    if (
      !transactionData.type ||
      !["INCOME", "EXPENSE"].includes(transactionData.type)
    ) {
      return reply.status(400).send({ message: "Tipo de transação inválido" });
    }
    if (typeof transactionData.optional !== "boolean") {
      return reply.status(400).send({ message: "Campo 'optional' inválido" });
    }
    if (typeof transactionData.value !== "number") {
      return reply.status(400).send({ message: "Campo 'value' inválido" });
    }
    if (
      transactionData.description &&
      typeof transactionData.description !== "string"
    ) {
      return reply
        .status(400)
        .send({ message: "Campo 'description' inválido" });
    }
    if (typeof transactionData.inCash !== "boolean") {
      return reply.status(400).send({ message: "Campo 'inCash' inválido" });
    }
    if (!transactionData.inCash && typeof transactionData.months !== "number") {
      return reply.status(400).send({ message: "Campo 'months' inválido" });
    }
    if (!transactionData.date) {
      return reply.status(400).send({ message: "Campo 'date' inválido" });
    }
    if (typeof transactionData.userId !== "string") {
      return reply.status(400).send({ message: "Campo 'userId' inválido" });
    }

    const newTransaction = await saveTransaction(transactionData);

    return reply
      .status(201)
      .send({ message: "Transação criada com sucesso", newTransaction });
  } catch (error) {
    return reply.status(500).send({
      message: "Erro interno do servidor",
      error,
    });
  }
}
