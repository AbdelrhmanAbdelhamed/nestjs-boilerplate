import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

export class UrlDecodeDto {
  @ApiProperty({
    description: `id to be decoded and redirected to the full url`,
    example: '559WLYubxkoB7PmkvJeHUi',
  })
  @IsNotEmpty()
  @IsString()
  id: string;
}
