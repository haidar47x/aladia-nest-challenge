import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AuthenticationModule } from './authentication.module';
import { Logger } from '@lib/logger';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthenticationModule,
    {
      bufferLogs: true,
      transport: Transport.TCP,
      options: {
        host: process.env.AUTH_SERVICE_HOST || '127.0.0.1',
        port: +(process.env.AUTH_SERVICE_PORT || 3001),
      },
    },
  );

  await app.listen();

  const logger = await app.resolve(Logger);
  app.useLogger(logger);
  logger.setContext(bootstrap.name);
  logger.log('Auth microservice is listening on :3001');
}

bootstrap();
