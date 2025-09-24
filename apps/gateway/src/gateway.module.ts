import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { CoreModule } from '@lib/core';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [CoreModule, AuthModule],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule {}
