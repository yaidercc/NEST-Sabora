"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileFilter = void 0;
const fileFilter = (req, file, callback) => {
    if (!file)
        return callback(new Error("File is empty"), false);
    const fileExtension = file.mimetype.split("/")[1];
    const validExtentions = ["jpg", "png", "webp", "jpeg", "gif"];
    if (!validExtentions.includes(fileExtension)) {
        return callback(null, false);
    }
    callback(null, true);
};
exports.fileFilter = fileFilter;
//# sourceMappingURL=fileFilter.js.map