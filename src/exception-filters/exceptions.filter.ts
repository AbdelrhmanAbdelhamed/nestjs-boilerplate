import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ResponseCode } from '../models/response-code.model';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof Error ? exception.message : 'Internal server error';

    const stack =
      process.env.NODE_ENV !== 'production' ? exception.stack : undefined;

    response.status(status).json({
      code: ResponseCode.FAILED,
      response: message,
      errors: [],
      stack,
    });
  }
}
