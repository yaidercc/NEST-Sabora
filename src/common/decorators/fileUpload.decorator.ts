import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';
import { fileFilter } from '../helpers/fileFilter';
import { CleanEmptyFieldsInterceptor } from '../interceptors/clean-empty-fields.interceptor';

export function FileUploader() {
    return applyDecorators(
        UseInterceptors(
            FileInterceptor("file", {
                fileFilter: fileFilter,
                limits: {
                    fileSize: 5 * 1024 * 1024
                }
            })
        ),
        UseInterceptors(CleanEmptyFieldsInterceptor),
        ApiConsumes('multipart/form-data'), // Tells swagger that it will recieve a file
    );
}