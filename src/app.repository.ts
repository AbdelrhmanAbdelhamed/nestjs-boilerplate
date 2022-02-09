/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotImplementedException } from '@nestjs/common';

@Injectable()
export class AppRepository<T> {
  create(data: T): Promise<T> {
    throw new NotImplementedException(
      'AppRepository.create method is not implemented',
    );
  }

  findOneByKey({ key }: { key: string }): Promise<T | null> {
    throw new NotImplementedException(
      'AppRepository.findOneByKey method is not implemented',
    );
  }

  async fetchOneByKey({ key }: { key: string }): Promise<T | null> {
    throw new NotImplementedException(
      'AppRepository.fetchOneByKey method is not implemented',
    );
  }
}
