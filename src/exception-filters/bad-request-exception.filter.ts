import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { ResponseCode } from 'src/models/response-code.model';

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const status = exception.getStatus();

    response.status(status).json({
      code: ResponseCode.FAILED,
      response: exception.message,
      errors: (exception.getResponse() as { errors?: string[] })?.errors || [],
      stack: undefined,
    });
  }
}
