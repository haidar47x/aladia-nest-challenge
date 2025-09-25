import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from '@lib/logger';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule, { bufferLogs: true });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(+(process.env.GATEWAY_PORT || 4532));

  const logger = await app.resolve(Logger);
  app.useLogger(logger);
  logger.setContext('Gateway Bootstap');
  logger.log('Gateway listening for incoming requests');
}

bootstrap();
