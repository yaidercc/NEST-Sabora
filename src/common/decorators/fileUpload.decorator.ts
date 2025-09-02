import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from '../helpers/fileFilter';

export function FileUploader() {
    return applyDecorators(
        UseInterceptors(
            FileInterceptor("file", {
                fileFilter: fileFilter,
                limits: {
                    fileSize: 5 * 1024 * 1024
                }
            })
        )
    );
}
