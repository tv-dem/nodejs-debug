const express = require('express');
const app = express();
const db = require('./db');
const user = require('./controllers/usercontroller');
const game = require('./controllers/gamecontroller')
const {json} = require('body-parser');
require('dotenv').config();

const start = async () => {
  await db.sync();
  app.listen(process.env.PORT, function () {
    console.log("App is listening on", process.env.PORT)
  })
}

app.use(json());
app.use('/api/auth', user);
app.use(require('./middleware/validate-session'))
app.use('/api/game', game);

start();

