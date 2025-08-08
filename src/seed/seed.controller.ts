import { Controller, Get} from '@nestjs/common';
import { SeedService } from './seed.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @ApiOperation({ summary: "Seed database" })
  @ApiResponse({ status: 200, description: "SEED EXECUTED" })
  @Get()
  findAll() {
    return this.seedService.executeSEED();
  }

}
