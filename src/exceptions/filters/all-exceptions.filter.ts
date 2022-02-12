import { I18nService } from 'nestjs-i18n';
import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { BaseExceptionFilter } from './base-exception.filter';
import { ResponseCode } from '../../models/response-code.model';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  constructor(
    protected readonly httpAdapterHost: HttpAdapterHost,
    private readonly i18n: I18nService,
  ) {
    super();
  }

  async catch(exception: Error, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = await this.getTranslatedMessage({
      message: this.getMessage(exception),
      translator: this.i18n,
      lang: ctx.getRequest().i18nLang,
    });

    const stack =
      process.env.NODE_ENV !== 'production' ? exception.stack : undefined;

    httpAdapter.reply(
      ctx.getResponse(),
      {
        code: ResponseCode.FAILED,
        response: message,
        errors: [],
        stack,
      },
      httpStatus,
    );
  }
}
