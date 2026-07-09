const { Sequelize } = require("sequelize");

const db = new Sequelize('zomato', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',


});
module.exports = db;
