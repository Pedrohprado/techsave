import z from 'zod';

const dotenvSchema = z.object({
  HOST: z.string().default('127.0.0.1'),
  PORT: z.string().default('3000'),

  //DATABASE_URL: z.string(),
});

const _env = dotenvSchema.safeParse(process.env);

if (!_env.success) {
  const err = z.treeifyError(_env.error).properties;
  console.error('Invalid environment variables!', err);
  throw new Error('Invalid enviroment variables!');
}

export const env = _env.data;