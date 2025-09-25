import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule, {});
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(+(process.env.GATEWAY_PORT || 4532));
  console.log('Gateway listening for incoming requests');
}

bootstrap();
