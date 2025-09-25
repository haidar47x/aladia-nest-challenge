import { Global, Module } from '@nestjs/common';
import { ConsoleLoggerService } from './console-logger.service';
import { Logger } from '@lib/logger/logger.abstract';

@Global()
@Module({
  providers: [
    {
      provide: Logger,
      useClass: ConsoleLoggerService,
    },
  ],
  exports: [Logger],
})
export class LoggerModule {}
