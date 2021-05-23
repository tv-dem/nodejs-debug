const Sequelize = require('sequelize');
require('dotenv').config();
//database username   password
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
})

sequelize.authenticate().then(
  () => console.log("Connected to DB"),
  (err) => console.log(`Error: ${err}`)
)

module.exports = sequelize;
