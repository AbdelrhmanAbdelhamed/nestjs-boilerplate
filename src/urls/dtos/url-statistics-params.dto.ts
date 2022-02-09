import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

export class UrlStatisticsParamsDto {
  @ApiProperty({
    description: `id of the target url to get its statistics`,
    example: '559WLYubxkoB7PmkvJeHUi',
  })
  @IsNotEmpty()
  @IsString()
  id: string;
}
