export const EnvConfiguration = () => ({
    db_port: process.env.DB_PORT || "5432",
    db_name: process.env.DB_NAME || "saboraDB",
    db_password: process.env.DB_PASSWORD,
    db_username: process.env.DB_USERNAME,
    db_host: process.env.DB_HOST || "localhost"
})

