const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const db = require('../db')
const {DataTypes} = require('sequelize')
const User = require('./../models/user')(db, DataTypes);

router.post('/signup', async (req, res) => {
  const {
    full_name,
    username,
    password,
    email
  } = req.body.user;
  try {
    const passwordHash = await bcrypt.hashSync(password, 10);
    const user = await User.create({
      full_name,
      username,
      passwordHash,
      email,
    })
    let token = jwt.sign({id: user.id}, process.env.SECRET_KEY, {expiresIn: 60 * 60 * 24});
    res.status(200).json({
      user: user,
      token: token
    })
  } catch (err) {
    res.status(500).send(err.message)
  }
})

router.post('/signin', async (req, res) => {
  const {
    username,
    password,
  } = req.body.user;
  const user = await User.findOne({where: {username}})
  if (!user) {
    return res.status(403).send({error: "User not found."})
  }
  const matches = await bcrypt.compare(password, user.passwordHash)
  if (!matches) {
    return res.status(502).send({error: "Passwords do not match."})
  }
  const token = jwt.sign({id: user.id}, process.env.SECRET_KEY, {expiresIn: 60 * 60 * 24});
  res.json({
    user,
    message: "Successfully authenticated.",
    sessionToken: token
  });

})

module.exports = router;
