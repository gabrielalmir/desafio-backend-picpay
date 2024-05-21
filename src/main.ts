import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { envSchema } from './config/env';

async function bootstrap() {
  // Setup the environment variables
  envSchema.parse(process.env);

  // Create the NestJS application
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  // Start the application
  await app.listen(3000);
}

bootstrap();
