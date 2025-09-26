import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: any = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getResponse();
    } else if (exception instanceof RpcException) {
      const error = exception.getError() as any;
      status =
        error?.statusCode || error?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      message = error?.message || error;
    } else if (typeof exception?.status === 'number') {
      status = exception.status;
      message = exception.message || exception.response?.message;
    } else if (typeof exception?.response?.statusCode === 'number') {
      status = exception.response.statusCode;
      message = exception.response.message;
    }

    this.logger.error(
      `HTTP Status: ${status}, Error: ${JSON.stringify(exception)}`,
    );

    response.status(status).json({
      timestamp: new Date().toISOString(),
      path: request.url,
      error: message,
    });
  }
}
