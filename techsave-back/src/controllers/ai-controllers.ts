import type { FastifyReply, FastifyRequest } from "fastify";
import { mastra } from "../mastra/index.js";

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

    const agent = mastra.getAgent("financialAgent");

    const response = await agent.generate(
      [
        {
          role: "system",
          content: `Você está conversando com o usuário ID: 1. Use as ferramentas disponíveis para buscar seus dados e personalizar a conversa.`,
        },
        {
          role: "user",
          content: message,
        },
      ],
      {
        maxSteps: 5,
      }
    );

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
