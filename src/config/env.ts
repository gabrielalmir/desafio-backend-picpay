import 'dotenv/config';
import { z } from 'zod';

export const envSchema = z.object({
    PORT: z.string().default('3000'),
    NODE_ENV: z.string().default('development'),
    DATABASE_URL: z.string(),
    AUTHORIZATION_SERVICE_URL: z.string().url().default('https://run.mocky.io/v3/5794d450-d2e2-4412-8131-73d0293ac1cc'),
    NOTIFICATION_SERVICE_URL: z.string().url().default('https://run.mocky.io/v3/54dc2cf1-3add-45b5-b5a9-6bf7e7f1f4a6'),
});

export const env = envSchema.parse(process.env);
