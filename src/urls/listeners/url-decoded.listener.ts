import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Url, UrlDocument } from '../schemas/url.schema';
import { OnEvent } from '@nestjs/event-emitter';
import { UrlDecodedEvent, URL_DECODED_EVENT_KEY } from '../events';

@Injectable()
export class UrlDecodedListener {
  constructor(
    @InjectModel(Url.name) private readonly urlModel: Model<UrlDocument>,
  ) {}

  @OnEvent(URL_DECODED_EVENT_KEY, { async: true })
  async incrementCountryVisits(event: UrlDecodedEvent) {
    await this.urlModel.updateOne(
      { id: event.id, 'visits.country': { $ne: event.visitCountry } },
      {
        $push: {
          visits: {
            country: event.visitCountry,
            count: 0,
          },
        },
      },
      { new: true },
    );

    return this.urlModel.updateOne(
      { id: event.id, 'visits.country': event.visitCountry },
      {
        $inc: {
          'visits.$.count': 1,
        },
      },
      { new: true },
    );
  }

  @OnEvent(URL_DECODED_EVENT_KEY, { async: true })
  async incrementTotalClicks(event: UrlDecodedEvent) {
    return this.urlModel.updateOne(
      { id: event.id },
      { $inc: { totalClicks: 1 } },
      { new: true },
    );
  }
}
