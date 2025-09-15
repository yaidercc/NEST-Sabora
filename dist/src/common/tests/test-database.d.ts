import { INestApplication } from "@nestjs/common";
import { TestingModule } from "@nestjs/testing";
export declare class TestDatabaseManager {
    private static module;
    private static app;
    private static initialized;
    static initializeE2E(): Promise<{
        module: TestingModule;
        app: INestApplication;
    }>;
    static initializeInt(): Promise<TestingModule>;
    static cleanUp(): Promise<void>;
}
