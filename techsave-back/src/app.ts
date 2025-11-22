import Fastify from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import 'dotenv/config';
import mainRoute from './routes/main-routes.js';

const app = Fastify();

app.register(cors, {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
});

app.register(swagger, {
  openapi: {
    info: {
      title: 'TechSave',
      description: 'Documentação gerada pelo Fastify Swagger',
      version: '1.0.0',
    },
  },
});

app.register(swaggerUI, {
  routePrefix: '/docs',
});

app.register(mainRoute, { prefix: '/api' });

export default app;
