import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from '@lib/logger';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule, { bufferLogs: true });
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const logger = await app.resolve(Logger);
  app.useLogger(logger);
  logger.setContext('Gateway Bootstrap');

  const config = new DocumentBuilder()
    .setTitle('Aladia Nest Challenge')
    .setDescription(
      'API documenation for the gateway and microservice for the Aladia Challenge.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  logger.log('Swagger API docs available at /api');

  logger.log('Gateway listening for incoming requests on :4532');
  await app.listen(+(process.env.GATEWAY_PORT || 4532));
}

bootstrap();
