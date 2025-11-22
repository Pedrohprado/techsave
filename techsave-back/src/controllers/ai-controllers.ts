import type { FastifyReply, FastifyRequest } from "fastify";
import { financialAgent } from "../mastra/agents/financialAgent.js";

interface SendMessageBody {
  userId: string;
  message: string;
}

export async function sendMessage(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { message } = req.body as SendMessageBody;

    if (!message) {
      return reply.status(400).send({
        message: "Mensagem não informada",
      });
    }

    const response = await financialAgent.generate(message);

    return reply.send({
      success: true,
      response: response.text,
    });
  } catch (error) {
    console.error("Error in sendMessage:", error);
    return reply.status(500).send({
      message: "Falha ao processar a mensagem",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
}
