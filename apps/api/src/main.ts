import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  app.enableCors({
    credentials: true,
    origin: (process.env.WEB_ORIGINS ?? 'http://localhost:3003,http://localhost:3004').split(','),
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const port = Number(process.env.API_PORT ?? 4040);
  await app.listen(port, '0.0.0.0');
}

void bootstrap();
