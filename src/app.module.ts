import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvConfiguration } from './config/env.config';
import { JoiEnvValidation } from './config/joi.validation';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { SeedModule } from './seed/seed.module';
import { MailerModule } from "@nestjs-modules/mailer";
import { EmployeeModule } from './employee/employee.module';
import { TableModule } from './table/table.module';
import { ReservationModule } from './reservation/reservation.module';
import { MenuItemModule } from './menu_item/menu_item.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfiguration],
      validationSchema: JoiEnvValidation
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT!,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true
    }),


    MailerModule.forRoot({
      transport: {
        host: 'smtp.sendgrid.net',
        port: 587,
        auth: {
          user: 'apikey',
          pass: process.env.SENDGRID_API_KEY,
        },
      },
      defaults: {
        from: '"Sabora 🍽️" <app.sabora.rest@gmail.com>',
      },
    }),
    UserModule,
    SeedModule,
    EmployeeModule,
    TableModule,
    ReservationModule,
    MenuItemModule,
    OrderModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
