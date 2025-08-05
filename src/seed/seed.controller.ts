import { Controller, Get} from '@nestjs/common';
import { SeedService } from './seed.service';
import { Auth } from 'src/user/decorators/auth.decorator';
import { GeneralRoles } from 'src/user/enums/roles';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  @Auth([GeneralRoles.admin])
  findAll() {
    return this.seedService.executeSEED();
  }

}
