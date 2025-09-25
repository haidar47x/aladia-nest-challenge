import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { CoreModule } from '@lib/core';

@Module({
  imports: [TerminusModule, CoreModule],
  controllers: [HealthController],
})
export class HealthModule {}
