import { Module } from '@nestjs/common';
import { CoreModule } from '@lib/core';
import { AuthModule } from './auth/auth.module';
import { LoggerModule } from '@lib/logger';
import { HealthModule } from './health/health.module';

@Module({
  imports: [CoreModule, AuthModule, LoggerModule, HealthModule],
})
export class GatewayModule {}
