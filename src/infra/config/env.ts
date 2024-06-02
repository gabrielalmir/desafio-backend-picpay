import 'dotenv/config';
import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.string().default('3000'),
  NODE_ENV: z.string().default('development'),
  DATABASE_URL: z.string(),
  AUTHORIZATION_SERVICE_URL: z
    .string()
    .url()
    .default('https://util.devi.tools/api/v2/authorize'),
  NOTIFICATION_SERVICE_URL: z
    .string()
    .url()
    .default('https://util.devi.tools/api/v1/notify'),
});

export const env = envSchema.parse(process.env);
