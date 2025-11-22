import type { FastifyReply, FastifyRequest } from "fastify";
import { mastra } from "../mastra/index.js";

interface SendMessageBody {
  userId: number;
  message: string;
}

export async function sendMessage(req: FastifyRequest, reply: FastifyReply) {
  try {
    let { userId, message } = req.body as SendMessageBody;

    if (!message) {
      return reply.status(400).send({
        message: "Mensagem não informada",
      });
    }

    if (!userId) {
      userId = 1;
    }

    const agent = mastra.getAgent("financialAgent");

    // Use userId como resourceId e threadId para manter memória de conversa por usuário
    const resourceId = `user-${userId}`;
    const threadId = `chat-${userId}`;

    const response = await agent.generate(
      [
        {
          role: "system",
          content: `Você está conversando com o usuário ID: ${userId}. Use as ferramentas disponíveis para buscar seus dados e personalizar a conversa. Lembre-se do contexto das mensagens anteriores e não repita informações já discutidas.`,
        },
        {
          role: "user",
          content: message,
        },
      ],
      {
        maxSteps: 5,
        threadId: threadId,
        resourceId: resourceId,
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
