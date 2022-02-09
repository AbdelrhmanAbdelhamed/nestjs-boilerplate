import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UrlsController } from './controllers';
import { UrlsRepository } from './repositories';
import { UrlsService } from './services';
import { IdentifierCreatorProvider } from './providers';
import { Url, UrlSchema } from './schemas/url.schema';
import { UrlDecodedListener } from './listeners';

@Module({
  imports: [MongooseModule.forFeature([{ name: Url.name, schema: UrlSchema }])],
  controllers: [UrlsController],
  providers: [
    UrlsRepository,
    UrlsService,
    IdentifierCreatorProvider,
    UrlDecodedListener,
  ],
})
export class UrlsModule {}
