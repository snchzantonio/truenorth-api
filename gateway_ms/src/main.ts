import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: process.env.NODE_ENV === 'development' ? ['log', 'debug', 'error', 'verbose', 'warn'] : ['error', 'warn'],
  });
  app.useGlobalPipes(new ValidationPipe({
    enableDebugMessages: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    stopAtFirstError: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));
  app.enableVersioning({
    type: VersioningType.URI
  });
  app.enableCors();
  await app.listen(process.env.GATEWAY_PORT || 3001);
  console.log(`RUNNIG at ${process.env.GATEWAY_PORT || 3001}!`);
}
bootstrap();
