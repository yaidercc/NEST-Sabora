"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoiEnvValidation = void 0;
const joi = require("joi");
exports.JoiEnvValidation = joi.object({
    DB_NAME: joi.string().default("saboraDB"),
    DB_USERNAME: joi.string().required(),
    PORT: joi.number().default(4000)
});
//# sourceMappingURL=joi.validation.js.map