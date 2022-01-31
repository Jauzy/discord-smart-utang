const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    operatorsAliases: false,
    logging: false,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    },
    ssl: true,
    dialectOptions: {
        ssl: {
            require: true
        }
    },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.utang = require("./utang.js")(sequelize, Sequelize)

module.exports = db;