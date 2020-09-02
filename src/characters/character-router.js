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
characterRouter.route('/:thing_id')
  .all(requireAuth)
  .all(checkThingExists)
  .get((req, res) => {
    res.json(ThingsService.serializeThing(res.thing))
  });

async function checkThingExists(req, res, next) {
  try {
    const character = await characterService.getById(
      req.app.get('db'),
      req.params.character_id
    )

    if (!thing)
      return res.status(404).json({
        error: `Thing doesn't exist`
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
  // expected output: "resolved"
}

module.exports = characterRouter
