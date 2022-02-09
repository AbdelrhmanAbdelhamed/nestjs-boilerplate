import { Visit } from '../schemas';

export class UrlStatisticsResponseDto {
  totalClicks: number | undefined;
  visits: Visit[] | undefined;
}
