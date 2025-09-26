import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcToHttpExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const error = exception.getError() as any;

    const status =
      error?.statusCode || error?.status || HttpStatus.INTERNAL_SERVER_ERROR;

    const message = error?.message || 'Internal server error';

    response.status(status).json({
      timestamp: new Date().toISOString(),
      path: request.url,
      error: message,
    });
  }
}
