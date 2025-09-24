import { Module } from '@nestjs/common';
import { NetworkingService } from '@lib/core/networking.service';

@Module({
  providers: [NetworkingService],
  exports: [NetworkingService],
})
export class CoreModule {}
