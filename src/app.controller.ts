import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Health Check')
@Controller({
  version: VERSION_NEUTRAL,
})
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: `Check service health` })
  @ApiOkResponse({ description: `The service is alive and healthy!` })
  @Get()
  getHealth(): string {
    return this.appService.getHealth();
  }
}
