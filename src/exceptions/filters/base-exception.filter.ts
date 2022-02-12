import { ArgumentsHost, HttpException } from '@nestjs/common';
import { BaseExceptionFilter as NestBaseExceptionFilter } from '@nestjs/core';
import { translateOptions } from 'nestjs-i18n';

export class BaseExceptionFilter extends NestBaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    super.catch(exception, host);
  }

  async getTranslatedMessage({
    message,
    translator,
    lang = 'en',
  }: {
    message?: string | object;
    translator: {
      translate: (key: string, options?: translateOptions) => Promise<any>;
    };
    lang: string;
  }) {
    if (!message || !translator) return;
    const parsedMessage = this.parseMessage(message);
    return translator.translate(parsedMessage.key, {
      lang,
      args: parsedMessage.args || {},
    });
  }

  parseMessage(message: string | object): {
    key: string;
    args: object;
  } {
    return typeof message === 'string'
      ? { key: message, args: {} }
      : (message as { key: string; args: object });
  }

  getMessage(exception: unknown) {
    return exception instanceof HttpException
      ? (exception.getResponse() as { message: string }).message ||
          exception.getResponse()
      : 'exceptions.INTERNAL_SERVER_MESSAGE';
  }
}
