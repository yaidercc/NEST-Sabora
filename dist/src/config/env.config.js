"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvConfiguration = void 0;
const EnvConfiguration = () => ({
    db_port: process.env.DB_PORT || "5432",
    db_name: process.env.DB_NAME || "saboraDB",
    db_password: process.env.DB_PASSWORD,
    db_username: process.env.DB_USERNAME,
    db_host: process.env.DB_HOST || "localhost"
});
exports.EnvConfiguration = EnvConfiguration;
//# sourceMappingURL=env.config.js.map