const router = require('express').Router();
const db = require('../db')
const {DataTypes} = require('sequelize')
const Game = require('./../models/game')(db, DataTypes);

router.get('/all', async (req, res) => {
  const games = await Game.findAll({where: {owner_id: req.user.id}})
  if (games) {
    return res.status(200).json({
      games,
      message: "Data fetched."
    })
  }
  res.status(500).json({
    message: "Data not found"
  })
})

router.get('/:id', async (req, res) => {
  const game = await Game.findOne({where: {id: req.params.id, owner_id: req.user.id}})
  if (game) {
    return res.status(200).json({
      game: game
    })
  }
  res.status(500).json({
    message: "Data not found."
  })
})

router.post('/create', async (req, res) => {
  const {
    title,
    studio,
    esrb_rating,
    user_rating,
    have_played
  } = req.body.game
  const owner_id = req.user.id;
  const game = await Game.create({
    title,
    owner_id,
    studio,
    esrb_rating,
    user_rating,
    have_played
  })
  if (game) {
    res.status(200).json({
      game: game,
      message: "Game created."
    })
    return;
  }
  res.status(500).send(err.message)
})

router.put('/update/:id', async (req, res) => {
  try {
    const {
      title,
      studio,
      esrb_rating,
      user_rating,
      have_played
    } = req.body.game
    const owner_id = req.user.id;
    const {id} = req.params
    const game = await Game.update({
        title,
        studio,
        esrb_rating,
        user_rating,
        have_played
      },
      {
        where: {
          id,
          owner_id
        }
      })
    res.status(200).json({
      game: game,
      message: "Successfully updated."
    })
  } catch (err) {
    res.status(500).json({
      message: err.message
    })
  }
})

router.delete('/remove/:id', async (req, res) => {
  try {
    const game = await Game.destroy({
      where: {
        id: req.params.id,
        owner_id: req.user.id,
      }
    })
    res.status(200).json({
      game: game,
      message: "Successfully deleted"
    })
  } catch(err){
    res.status(500).json({
      error: err.message
    })
  }
})

module.exports = router;
