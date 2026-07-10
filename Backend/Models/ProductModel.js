const db = require('../Config/db');
const { DataTypes } = require('sequelize');

const Product = db.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    productname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    productdescription: {
        type: DataTypes.STRING,
        allowNull: false
    },
    productprice: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    productcategory: {
        type: DataTypes.STRING,
        allowNull: false
    },
    productstock: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    image: {
        type: DataTypes.TEXT,
        allowNull: true,
    }
});

module.exports = Product;