import { type FastifyInstance } from 'fastify';
import { transactionRoutes } from './transaction-routes.js';
import userRoutes from './user-routes.js';

export default async function mainRoute(fastify: FastifyInstance) {
  await fastify.register(userRoutes, { prefix: '/user' });
  await fastify.register(transactionRoutes, { prefix: '/transaction' });
}
