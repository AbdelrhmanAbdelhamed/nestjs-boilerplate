/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotImplementedException } from '@nestjs/common';

@Injectable()
export class BaseRepository<T> {
  create(data: T): Promise<T> {
    throw new NotImplementedException(
      'BaseRepository.create method is not implemented',
    );
  }

  findOneByKey({ key }: { key: string }): Promise<T | null> {
    throw new NotImplementedException(
      'BaseRepository.findOneByKey method is not implemented',
    );
  }

  async fetchOneByKey({ key }: { key: string }): Promise<T | null> {
    throw new NotImplementedException(
      'BaseRepository.fetchOneByKey method is not implemented',
    );
  }
}
