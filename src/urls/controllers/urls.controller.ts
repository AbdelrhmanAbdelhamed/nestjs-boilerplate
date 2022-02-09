import { Body, Controller, Get, Param, Post, Redirect } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { RequestCountry } from '../../decorators';
import {
  UrlDecodeDto,
  UrlEncodeDto,
  UrlStatisticsParamsDto,
  UrlStatisticsResponseDto,
} from '../dtos';
import { UrlsService } from '../services';

@ApiTags('Urls')
@Controller({
  path: 'urls',
  version: '1',
})
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @ApiOperation({ summary: `Create a shorter url for the given url` })
  @ApiOkResponse({ description: `Url short id created successfully` })
  @Post('encode')
  async encode(
    @Body()
    body: UrlEncodeDto,
    @RequestCountry()
    requestCountry: string,
  ): Promise<{ id: string }> {
    return this.urlsService.encode({ ...body, requestCountry });
  }

  @ApiOperation({ summary: `Get the original url from the short identifier` })
  @ApiOkResponse({ description: `Long original url` })
  @Get('decode/:id')
  @Redirect()
  async decode(
    @Param()
    params: UrlDecodeDto,
    @RequestCountry({ defaultCountry: 'OTHERS' })
    requestCountry: string,
  ): Promise<{ url: string }> {
    return this.urlsService.decode({ ...params, requestCountry });
  }

  @ApiOperation({ summary: `Get some statistics for the short identifier` })
  @ApiOkResponse({
    description: `Click count and country visits count for the url`,
  })
  @Get('statistics/:id')
  async getStatistics(
    @Param()
    params: UrlStatisticsParamsDto,
  ): Promise<UrlStatisticsResponseDto> {
    return this.urlsService.getStatistics({ ...params });
  }
}
