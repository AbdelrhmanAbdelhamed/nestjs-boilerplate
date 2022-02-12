import { NotFoundException } from '@nestjs/common';

export class UrlNotFoundException extends NotFoundException {
  constructor(objectOrError?: string | object | any, description?: string) {
    super(objectOrError || `exceptions.URL_NOT_FOUND_MESSAGE`, description);
  }
}
