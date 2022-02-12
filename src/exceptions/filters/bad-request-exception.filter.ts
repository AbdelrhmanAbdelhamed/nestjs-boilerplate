import { Catch, ArgumentsHost, BadRequestException } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { I18nService } from 'nestjs-i18n';
import { BaseExceptionFilter } from './base-exception.filter';
import { ResponseCode } from '../../models/response-code.model';

@Catch(BadRequestException)
export class BadRequestExceptionFilter extends BaseExceptionFilter {
  constructor(
    protected readonly httpAdapterHost: HttpAdapterHost,
    private readonly i18n: I18nService,
  ) {
    super();
  }

  async catch(exception: BadRequestException, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    const httpStatus = exception.getStatus();

    httpAdapter.reply(
      ctx.getResponse(),
      {
        code: ResponseCode.FAILED,
        response: await this.getTranslatedMessage({
          message: this.getMessage(exception),
          translator: this.i18n,
          lang: ctx.getRequest().i18nLang,
        }),
        errors:
          (exception.getResponse() as { errors?: string[] })?.errors || [],
        stack: undefined,
      },
      httpStatus,
    );
  }
}
