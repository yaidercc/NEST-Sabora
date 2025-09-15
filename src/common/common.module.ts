// common/common.module.ts (archivo nuevo)
import { Module } from '@nestjs/common';
import { UploadService } from './services/upload.service';
import { ConfigModule } from '@nestjs/config';
import { StripeService } from './services/stripe.service';

@Module({
    imports: [ConfigModule],
  providers: [UploadService,StripeService],
    exports: [UploadService,StripeService],
})
export class CommonModule { }