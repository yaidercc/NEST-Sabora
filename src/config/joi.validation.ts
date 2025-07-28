import * as joi from "joi"

export const JoiEnvValidation = joi.object({

    DB_NAME: joi.string().default("saboraDB"),
    DB_USERNAME: joi.string().required(),
    PORT: joi.number().default(4000)
})