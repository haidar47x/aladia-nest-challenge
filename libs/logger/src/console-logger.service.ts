import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';
import { Logger } from './logger.abstract';

@Injectable({ scope: Scope.TRANSIENT })
export class ConsoleLoggerService extends ConsoleLogger implements Logger {
  setContext(context: string) {
    this.context = context;
  }
}
