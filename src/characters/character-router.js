const express = require('express');
const characterService = require('./character-service');
const { requireAuth } = require('../middleware/jwt-auth');
const characterRouter = express.Router();
const jsonParser = express.json();

characterRouter
  .route('/')
  .get((req, res, next) => {
    characterService.getAllCharacters(req.app.get('db'))
      .then(chars => {
        res.json(characterService.serializeCharacters(chars));
      })
      .catch(next);
  })


characterRouter.route('/:char_id')
  .all(requireAuth)
  .all(checkCharExists)
  .get((req, res) => {
    res.json(characterService.serializeCharacter(res.character))
  })
  .patch(jsonParser, (req, res, next) => {
    const char_id = req.params.char_id;
    const { name, race, cclass, strength, dexterity, intelligence, health, hit_points, will, perception, fatigue_points, abilities, background_story } = req.body;
    const charToUpdate = { name, race, cclass, strength, dexterity, intelligence, health, hit_points, will, perception, fatigue_points, abilities, background_story };
    const numberOfValues = Object.values(charToUpdate).filter(Boolean).length;
    console.log('ran ' + numberOfValues + 'times' + ' ' + charToUpdate + ' ' + JSON.stringify(req.body))
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'name', 'race', 'class', 'strength', 'intelligence', 'dexterity', 'health', 'hit_points', 'will', 'perception', or 'fatigue_points'`
        }
      });

    characterService.updateChar(
      req.app.get('db'),
      char_id,
      charToUpdate
    )
      .then(char => {
        res.status(204).json({ message: 'changes submitted' }).end();
      })
      .catch(next);
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
