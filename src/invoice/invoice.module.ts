import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { OrderModule } from 'src/order/order.module';
import { CommonModule } from 'src/common/common.module';
import { UserModule } from 'src/user/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice]), OrderModule,CommonModule, UserModule, ConfigModule],
  controllers: [InvoiceController],
  providers: [InvoiceService],
  exports: [TypeOrmModule, InvoiceService]
})
export class InvoiceModule { }
