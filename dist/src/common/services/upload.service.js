"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const cloudinary_1 = require("cloudinary");
const config_1 = require("@nestjs/config");
const handleErrors_1 = require("../helpers/handleErrors");
const uuid_1 = require("uuid");
let UploadService = class UploadService {
    configService;
    logger = new common_1.Logger("UploadService");
    constructor(configService) {
        this.configService = configService;
        cloudinary_1.v2.config({
            cloud_name: this.configService.get("CLOUDINARY_CLOUD_NAME"),
            api_key: this.configService.get("CLOUDINARY_API_KEY"),
            api_secret: this.configService.get("CLOUDINARY_API_SECRET"),
        });
    }
    async create(file) {
        if (!file)
            throw new common_1.BadRequestException("File is empty");
        const fileExtension = file.mimetype.split("/")[1];
        const fileName = `${(0, uuid_1.v4)()}.${fileExtension}`;
        try {
            const response = await new Promise((resolve, reject) => {
                cloudinary_1.v2.uploader.upload_stream({
                    resource_type: "auto",
                    folder: "sabora",
                    public_id: fileName
                }, (error, result) => {
                    if (error)
                        reject(error);
                    else
                        resolve(result);
                }).end(file.buffer);
            });
            return response?.secure_url;
        }
        catch (error) {
            (0, handleErrors_1.handleException)(this.logger, error);
        }
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], UploadService);
//# sourceMappingURL=upload.service.js.map