import { Module } from '@nestjs/common';
import { TableService } from './table.service';
import { TableController } from './table.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Table } from './entities/table.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [TableController],
  providers: [TableService],
  imports: [
    TypeOrmModule.forFeature([Table]),
    UserModule
  ],
  exports: [TypeOrmModule,TableService]
})
export class TableModule { }
