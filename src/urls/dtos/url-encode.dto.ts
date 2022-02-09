import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsUrl } from 'class-validator';
import { convertUrlToHttps } from '../utils/convert-url-to-https.util';

export class UrlEncodeDto {
  @ApiProperty({
    description: `url name to be encoded`,
    example: `https://www.google.com`,
  })
  @IsNotEmpty()
  @IsUrl()
  @Transform((urlName) => convertUrlToHttps(urlName.value))
  urlName: string;
}
