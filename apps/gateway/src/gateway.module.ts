import { Module } from '@nestjs/common';
import { CoreModule } from '@lib/core';
import { AuthModule } from './auth/auth.module';
import { LoggerModule } from '@lib/logger';

@Module({
  imports: [CoreModule, AuthModule, LoggerModule],
})
export class GatewayModule {}
