<<<<<<< HEAD
import { type FastifyInstance } from 'fastify';
import { transactionRoutes } from './transaction-routes.js';
import userRoutes from './user-routes.js';

export default async function mainRoute(fastify: FastifyInstance) {
  await fastify.register(userRoutes, { prefix: '/user' });
  await fastify.register(transactionRoutes, { prefix: '/transaction' });
=======
import { type FastifyInstance } from "fastify";
import { userRoutes } from "./user-routes.js";
import { transactionRoutes } from "./transaction-routes.js";
import { aiRoutes } from "./ai-routes.js";

export default async function mainRoute(fastify: FastifyInstance) {
  await fastify.register(userRoutes, { prefix: "/user" });
  await fastify.register(transactionRoutes, { prefix: "/transaction" });
  await fastify.register(aiRoutes, { prefix: "/ai" });
>>>>>>> 9db13c68d3c34482a6a53daf9a84539581fffc3a
}
