import { type FastifyInstance } from 'fastify';
import { userRoutes } from './user-routes.js';
import { transactionRoutes } from './transaction-routes.js';

export default async function mainRoute(fastify: FastifyInstance) {
  await fastify.register(userRoutes, { prefix: '/user' });
  await fastify.register(transactionRoutes, { prefix: '/transaction' });
}