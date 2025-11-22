import type { FastifyReply, FastifyRequest } from 'fastify';
import z, { email } from 'zod';
import { createUserService } from '../services/user-services.js';
import { createGoals } from '../services/goal-services.js';

export async function createUser(request: FastifyRequest, reply: FastifyReply) {
  const userBodySchema = z.object({
    name: z.string(),
    age: z.string(),
    email: z.email(),
    password: z.string(),
    income: z.number(),
    money_saved: z.number(),
    goals: z.array(
      z.object({
        goal: z.string(),
        primary: z.boolean(),
        value: z.number().optional(),
        term: z.enum(['SHORT_TERM', 'MEDIUM_TERM', 'LONG_TERM']),
      })
    ),
  });

  const { age, email, name, password, income, money_saved, goals } =
    userBodySchema.parse(request.body);

  const userInformations = { age, email, name, password, income, money_saved };

  try {
    const { id } = await createUserService(userInformations);

    await createGoals(goals, id);

    return reply.send();
  } catch (error) {
    return reply.status(500).send({
      message: 'Erro interno no servidor',
    });
  }
}
