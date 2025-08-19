const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("construction_estimator", "root", "2530", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

module.exports = sequelize;
