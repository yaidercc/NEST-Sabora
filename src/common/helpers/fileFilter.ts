import { Request } from "express";

export const fileFilter = (req: Request, file: Express.Multer.File, callback: Function) => {
    if (!file) return callback(new Error("File is empty"), false)

    const fileExtension = file.mimetype.split("/")[1]
    const validExtentions = ["jpg", "png", "webp", "jpeg", "gif"]

    if(!validExtentions.includes(fileExtension)){
        return callback(null, false)
    }

    callback(null, true)
}