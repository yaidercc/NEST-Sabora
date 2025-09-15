"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUploader = FileUploader;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const fileFilter_1 = require("../helpers/fileFilter");
const clean_empty_fields_interceptor_1 = require("../interceptors/clean-empty-fields.interceptor");
function FileUploader() {
    return (0, common_1.applyDecorators)((0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file", {
        fileFilter: fileFilter_1.fileFilter,
        limits: {
            fileSize: 5 * 1024 * 1024
        }
    })), (0, common_1.UseInterceptors)(clean_empty_fields_interceptor_1.CleanEmptyFieldsInterceptor), (0, swagger_1.ApiConsumes)('multipart/form-data'));
}
//# sourceMappingURL=fileUpload.decorator.js.map