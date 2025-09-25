import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AuthenticationModule } from './authentication.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthenticationModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.AUTH_SERVICE_HOST || '127.0.0.1',
        port: +(process.env.AUTH_SERVICE_PORT || 3001),
      },
    },
  );
  await app.listen();

  console.log('Auth microservice is listening on port 3001 (TCP)');
}

bootstrap();
