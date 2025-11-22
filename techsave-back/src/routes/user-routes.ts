import type { FastifyInstance } from 'fastify';
import { createUser } from '../controllers/user-controllers.js';

export default async function userRoutes(fastify: FastifyInstance) {
  fastify.post('/', createUser);
}
