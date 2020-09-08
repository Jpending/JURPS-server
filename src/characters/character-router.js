const express = require('express');
const characterService = require('./character-service');
const { requireAuth } = require('../middleware/jwt-auth');
const characterRouter = express.Router();

characterRouter
  .route('/')
  .get((req, res, next) => {
    characterService.getAllCharacters(req.app.get('db'))
      .then(chars => {
        res.json(characterService.serializeCharacters(chars));
      })
      .catch(next);
  });
characterRouter.route('/:char_id')
  .all(requireAuth)
  .all(checkCharExists)
  .get((req, res) => {
    res.json(characterService.serializeCharacter(res.character))
  });

async function checkCharExists(req, res, next) {
  try {
    const character = await characterService.getById(
      req.app.get('db'),
      req.params.char_id
    )

    if (!character)
      return res.status(404).json({
        message: req.params.char_id,
        error: `That doesn't exist`
      })

    res.character = character
    next()
  } catch (error) {
    next(error)
  }
};

async function asyncCall() {
  console.log('calling');
  const result = await resolveAfter2Seconds();
  console.log(result);

}

module.exports = characterRouter
