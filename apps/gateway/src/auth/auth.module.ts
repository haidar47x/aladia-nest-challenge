import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { CoreModule } from '@lib/core';

@Module({
  imports: [CoreModule],
  controllers: [AuthController],
})
export class AuthModule {}
