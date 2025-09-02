import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from "cloudinary"
import { ConfigService } from '@nestjs/config';
import { handleException } from 'src/common/helpers/handleErrors';
import { v4 as uuid } from "uuid"
@Injectable()
export class UploadService {
  private readonly logger = new Logger("UploadService")
  constructor(
    private readonly configService: ConfigService
  ) {
    cloudinary.config({
      cloud_name: this.configService.get("CLOUDINARY_CLOUD_NAME"),
      api_key: this.configService.get("CLOUDINARY_API_KEY"),
      api_secret: this.configService.get("CLOUDINARY_API_SECRET"),
    })
  }
  async create(file: Express.Multer.File) {
    if (!file) throw new BadRequestException("File is empty")

    const fileExtension = file.mimetype.split("/")[1]
    const fileName = `${uuid()}.${fileExtension}`

    try {
      const response: UploadApiResponse | undefined = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: "auto",
            folder: "sabora",
            public_id: fileName
          },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          }
        ).end(file.buffer)
      })

      return response?.secure_url
    } catch (error) {
      handleException(this.logger, error)
    }
  }

}
