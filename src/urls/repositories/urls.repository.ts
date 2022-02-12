import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cache } from 'cache-manager';
import { Url, UrlDocument } from '../schemas';
import { BaseRepository } from '../../base.repository';

@Injectable()
export class UrlsRepository implements BaseRepository<Url> {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectModel(Url.name) private readonly urlModel: Model<UrlDocument>,
  ) {}

  async create(url: Url) {
    return this.urlModel.create<Url>(url);
  }

  /**
   * It will try to get a url from the cache, if cache miss then it will fetch it from db
   * @param "{ key }" string key used to find the url, it could be id or name
   * @returns Promise<UrlDocument | null>
   */
  async findOneByKey({ key }: { key: string }): Promise<UrlDocument | null> {
    const cachedUrl = await this.cacheManager.get<UrlDocument>(key);
    if (cachedUrl) {
      return cachedUrl;
    }

    const url = await this.fetchOneByKey({ key });
    return url;
  }

  /**
   * It will fetch a url from the db directly and update the cache
   * @param "{ key }" string key used to fetch the url, it could be id or name
   * @returns Promise<UrlDocument | null>
   */
  async fetchOneByKey({ key }: { key: string }): Promise<UrlDocument | null> {
    const url = await this.urlModel.findOne({
      $or: [{ id: key }, { name: key }],
    });

    if (!url) {
      return null;
    }

    this.cacheManager.set<UrlDocument>(key, url, { ttl: 0 });

    return url;
  }
}
