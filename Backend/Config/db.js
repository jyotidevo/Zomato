const { Sequelize } = require("sequelize");

const db = new Sequelize("mysql://root:DQjecVQflyAZBagrdqBUGTHpQuzwnBPJ@hayabusa.proxy.rlwy.net:36889/railway", {
    dialect: "mysql",
    logging: false,
});

module.exports = db;

