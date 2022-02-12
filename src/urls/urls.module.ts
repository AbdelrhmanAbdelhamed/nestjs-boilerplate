import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UrlsController } from './controllers';
import { UrlsRepository } from './repositories';
import { UrlsService } from './services';
import { IdentifierCreatorProvider } from './providers';
import { Url, UrlSchema } from './schemas/url.schema';
import { UrlDecodedListener } from './listeners';
import {
  AcceptLanguageResolver,
  I18nJsonParser,
  I18nModule,
} from 'nestjs-i18n';
import * as path from 'path';
@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      parser: I18nJsonParser,
      parserOptions: {
        path: path.join(__dirname, '../i18n/'),
        watch: true,
      },
      resolvers: [AcceptLanguageResolver],
    }),
    MongooseModule.forFeature([{ name: Url.name, schema: UrlSchema }]),
  ],
  controllers: [UrlsController],
  providers: [
    UrlsRepository,
    UrlsService,
    IdentifierCreatorProvider,
    UrlDecodedListener,
  ],
})
export class UrlsModule {}
