import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { GeneralRole } from './entities/general_role.entity';
import { PassportModule } from "@nestjs/passport"
import { JwtModule } from "@nestjs/jwt"
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwtstrategy';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User, GeneralRole]),
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return {
          secret: configService.get("JWT_SECRET"),
          signOptions: {
            expiresIn: "4h"
          }
        }
      },
    })
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
  exports: [TypeOrmModule, UserService, TypeOrmModule, PassportModule, JwtModule]
})
export class UserModule { }
