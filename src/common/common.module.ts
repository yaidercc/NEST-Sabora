// common/common.module.ts (archivo nuevo)
import { Module } from '@nestjs/common';
import { UploadService } from './services/upload.service';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ConfigModule],
  providers: [UploadService],
    exports: [UploadService],
})
export class CommonModule { }