const jwt = require('jsonwebtoken');
const db = require('../db')
const {DataTypes} = require('sequelize')
const User = require('./../models/user')(db, DataTypes);
require('dotenv').config();

module.exports = async (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next();   // allowing options as a method for request
  }
  const sessionToken = req.headers.authorization;
  if (!sessionToken) {
    return res.status(403).send({auth: false, message: "No token provided."});
  }
  const decoded = jwt.verify(sessionToken, process.env.SECRET_KEY)
  if (!decoded) {
    return res.status(400).send({error: "not authorized"})
  }
  const user = await User.findOne({where: {id: decoded.id}})
  if (user) {
    req.user = user;
    return next()
  }
  res.status(401).send({error: "not authorized"});
}
