const { DataTypes } = require("sequelize");
const sequelize = require("./db");

const Quote = sequelize.define("Quote", {
  name: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  notes: { type: DataTypes.TEXT },
  form: { type: DataTypes.JSON },
  calcResult: { type: DataTypes.JSON },
});

module.exports = Quote;
