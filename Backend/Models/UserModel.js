const db = require("../Config/db");
const { DataTypes } = require("sequelize");

const User = db.define(
    "User",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        mobile: {
            type: DataTypes.STRING(10),
            allowNull: false,
            unique: true,
            validate: {
                len: [10, 10],
            },
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = User;