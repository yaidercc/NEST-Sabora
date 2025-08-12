import { INestApplication } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EnvConfiguration } from "src/config/env.config";
import { JoiEnvValidation } from "src/config/joi.validation";
import { EmployeeModule } from "src/employee/employee.module";
import { EmployeeService } from "src/employee/employee.service";
import { Employee } from "src/employee/entities/employee.entity";
import { EmployeeRole } from "src/employee/entities/employee_role.entity";
import { SeedModule } from "src/seed/seed.module";
import { SeedService } from "src/seed/seed.service";
import { GeneralRole } from "src/user/entities/general_role.entity";
import { User } from "src/user/entities/user.entity";
import { UserModule } from "src/user/user.module";

export class TestDatabaseManager {
    private static module: TestingModule;
    private static app: INestApplication;
    private static initialized = false;

    static async initialize(): Promise<{ module: TestingModule; app: INestApplication }> {
        if (!this.initialized) {
            this.module = await Test.createTestingModule({
                imports: [
                    ConfigModule.forRoot({
                        envFilePath: ".env.test",
                        load: [EnvConfiguration],
                        validationSchema: JoiEnvValidation
                    }),
                    TypeOrmModule.forRoot({
                        type: "postgres",
                        host: "localhost",
                        port: +process.env.DB_PORT!,
                        database: process.env.DB_NAME,
                        username: process.env.DB_USERNAME,
                        password: process.env.DB_PASSWORD,
                        entities: [User, GeneralRole, Employee, EmployeeRole],
                        synchronize: true,
                        dropSchema: true
                    }),
                    TypeOrmModule.forFeature([User, GeneralRole, Employee, EmployeeRole]),
                    UserModule,
                    SeedModule,
                    EmployeeModule
                ],
                providers: [EmployeeService, JwtService, SeedService]
            }).compile()

            this.app = this.module.createNestApplication();
            await this.app.init()
        }

        return {
            module: this.module,
            app: this.app
        }
    }

    static async cleanUp(): Promise<void> {
        if (this.app) {
            await this.app.close()
            this.initialized = false;
        }
    }

}