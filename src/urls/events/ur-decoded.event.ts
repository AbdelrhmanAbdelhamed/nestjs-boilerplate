export const URL_DECODED_EVENT_KEY = 'url.decoded';

export class UrlDecodedEvent {
  id: string;
  name: string;
  visitCountry: string;

  constructor({
    id,
    name,
    visitCountry,
  }: {
    id: string;
    name: string;
    visitCountry: string;
  }) {
    this.id = id;
    this.name = name;
    this.visitCountry = visitCountry;
  }
}
