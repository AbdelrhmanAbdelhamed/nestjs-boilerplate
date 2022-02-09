import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UrlsRepository } from '../repositories';
import { IdentifierCreator } from '../models';
import { InjectIdentifierCreatorToken } from '../decorators';
import {
  UrlDecodeDto,
  UrlEncodeDto,
  UrlStatisticsParamsDto,
  UrlStatisticsResponseDto,
} from '../dtos';
import { UrlDecodedEvent, URL_DECODED_EVENT_KEY } from '../events';

@Injectable()
export class UrlsService {
  constructor(
    private readonly urlsRepository: UrlsRepository,
    private readonly eventEmitter: EventEmitter2,
    @InjectIdentifierCreatorToken()
    private readonly identifierCreator: IdentifierCreator,
  ) {}

  async encode({
    urlName,
    requestCountry,
  }: UrlEncodeDto & { requestCountry: string }): Promise<{ id: string }> {
    const existingUrl = await this.urlsRepository.findOneByKey({
      key: urlName,
    });

    if (existingUrl) {
      return { id: existingUrl.id };
    }

    const createdId = this.identifierCreator.create();

    await this.urlsRepository.create({
      id: createdId,
      name: urlName,
      encodeRequestCountry: requestCountry,
    });

    return { id: createdId };
  }

  async decode({
    id,
    requestCountry,
  }: UrlDecodeDto & { requestCountry: string }): Promise<{ url: string }> {
    const url = await this.urlsRepository.findOneByKey({ key: id });

    if (!url) {
      throw new NotFoundException(
        `This is a 404 error, which means you've clicked on a bad link or entered an invalid URL. P.S. links are case sensitive.`,
      );
    }

    this.eventEmitter.emitAsync(
      URL_DECODED_EVENT_KEY,
      new UrlDecodedEvent({
        id,
        name: url.name,
        visitCountry: requestCountry,
      }),
    );

    return { url: url.name };
  }

  async getStatistics({
    id,
  }: UrlStatisticsParamsDto): Promise<UrlStatisticsResponseDto> {
    const url = await this.urlsRepository.fetchOneByKey({ key: id });

    if (!url) {
      throw new NotFoundException(
        `This is a 404 error, which means you've entered an invalid URL. P.S. links are case sensitive.`,
      );
    }

    return { totalClicks: url.totalClicks, visits: url.visits };
  }
}
