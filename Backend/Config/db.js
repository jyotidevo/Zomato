const Sequelize = require("sequelize");

let db;
if (process.env.MYSQL_URL || process.env.DATABASE_URL) {
    db = new Sequelize(process.env.MYSQL_URL || process.env.DATABASE_URL, {
        dialect: 'mysql',
    });
} else {
    db = new Sequelize(
        process.env.DB_NAME || process.env.MYSQLDATABASE,
        process.env.DB_USER || process.env.MYSQLUSER,
        process.env.DB_PASSWORD || process.env.MYSQLPASSWORD,
        {
            host: process.env.DB_HOST || process.env.MYSQLHOST,
            port: process.env.DB_PORT || process.env.MYSQLPORT,
            dialect: 'mysql',
        }
    );
}

module.exports = db;