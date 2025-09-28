module.exports = {
    HOST: process.env.DB_HOST || "database-1.cleya8eei4v2.eu-west-2.rds.amazonaws.com",
    USER: process.env.DB_USER || "admin",
    PASSWORD: process.env.DB_PASSWORD || "admin123",
    DB: process.env.DB_NAME || "database-1",
    dialect: "mysql"
};

