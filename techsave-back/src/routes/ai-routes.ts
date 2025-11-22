import type { FastifyInstance } from "fastify";
import { sendMessage } from "../controllers/ai-controllers.js";

export function aiRoutes(fastify: FastifyInstance) {
  fastify.post("/chat", {}, sendMessage);
}
