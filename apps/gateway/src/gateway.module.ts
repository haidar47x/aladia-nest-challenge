import { Module } from '@nestjs/common';
import { CoreModule } from '@lib/core';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [CoreModule, AuthModule],
})
export class GatewayModule {}
