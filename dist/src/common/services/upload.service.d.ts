import { ConfigService } from '@nestjs/config';
export declare class UploadService {
    private readonly configService;
    private readonly logger;
    constructor(configService: ConfigService);
    create(file: Express.Multer.File): Promise<string | undefined>;
}
