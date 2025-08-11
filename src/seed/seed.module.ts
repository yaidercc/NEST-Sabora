import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { UserModule } from 'src/user/user.module';
import { EmployeeModule } from 'src/employee/employee.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [UserModule,EmployeeModule],
  exports: [SeedService]
})
export class SeedModule {}
