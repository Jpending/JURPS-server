/* eslint-disable no-unused-vars */
/* eslint-disable quotes */
/* eslint-disable eqeqeq */
const path = require('path');
const express = require('express');
const xss = require('xss');
const UsersService = require('./users-service');
const characterService = require('../characters/character-service');
const usersRouter = express.Router();
const jsonParser = express.json();
const { requireAuth } = require('../middleware/jwt-auth');

usersRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    UsersService.getAllUsers(knexInstance)
      .then(users => {
        res.json(users.map(UsersService.serializeUser));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { email, user_name, display_name, password } = req.body;

    for (const field of ['email', 'display_name', 'user_name', 'password'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        });

    const EmailError = UsersService.validateEmail(email);
    if (EmailError)
      return res.status(400).json({ error: EmailError });

    const DisplayNameError = UsersService.validateDisplayName(display_name);
    if (DisplayNameError)
      return res.status(400).json({ error: DisplayNameError });

    const usernameError = UsersService.validateUserName(user_name);
    if (usernameError)
      return res.status(400).json({ error: usernameError });

    const passwordError = UsersService.validatePassword(password);
    if (passwordError)
      return res.status(400).json({ error: passwordError });

    UsersService.hasUserWithUserName(
      req.app.get('db'),
      user_name
    )
      .then(hasUserWithUserName => {
        if (hasUserWithUserName)
          return res.status(400).json({ error: `Username already taken` });

        return UsersService.hashPassword(password)
          .then(hashedPassword => {
            const newUser = {
              user_name,
              password: hashedPassword,
              email,
              display_name,
              date_created: 'now()',
            };

            return UsersService.insertUser(
              req.app.get('db'),
              newUser
            )
              .then(user => {
                res
                  .status(201)
                  .location(path.posix.join(req.originalUrl, `/${user.id}`))
                  .json(UsersService.serializeUser(user));
              })
              .catch(next);
          });
      });
  });

usersRouter
  .route('/:user_id/Characters')
  .all(requireAuth)
  .get((req, res, next) => {
    UsersService.getUserChars(
      req.app.get('db'),
      req.params.user_id)
      .then(chars => {
        res.json(characterService.serializeCharacters(chars));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const user_id = req.params.user_id;
    const { name, race, cclass, strength, dexterity, intelligence, health, hit_points, will, perception, fatigue_points, abilities, background_story } = req.body;
    for (const field of ['name', 'race', 'cclass', 'strength', 'intelligence', 'dexterity', 'health', 'hit_points', 'will', 'perception', 'fatigue_points'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        });
    const nameError = characterService.validatefield(name);
    if (nameError)
      return res.status(400).json({ error: nameError });
    const raceError = characterService.validatefield(race);
    if (raceError)
      return res.status(400).json({ error: raceError });
    const classError = characterService.validatefield(cclass);
    if (classError)
      return res.status(400).json({ error: classError });
    const abilitiesError = characterService.validatefield(abilities);
    if (abilitiesError)
      return res.status(400).json({ error: abilitiesError });
    const storyError = characterService.validatefield(background_story);
    if (storyError)
      return res.status(400).json({ error: storyError });
    const newChar = {
      name, race, cclass,
      strength, dexterity, intelligence, health, hit_points, will, perception, fatigue_points, user_id,
      abilities, background_story
    };
    return characterService.insertChar(
      req.app.get('db'),
      newChar
    )
      .then(char => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${char.id}`))
          .json(characterService.serializeCharacter(char));
      })
      .catch(next);
  });


usersRouter
  .route('/:user_id')
  .all((req, res, next) => {
    UsersService.getById(
      req.app.get('db'),
      req.params.user_id
    )
      .then(user => {
        if (!user) {
          return res.status(404).json({
            error: { message: `User doesn't exist` }
          });
        }
        res.user = user;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(UsersService.serializeUser(res.user));
  })
  .delete((req, res, next) => {
    UsersService.deleteUser(
      req.app.get('db'),
      req.params.user_id
    )
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const { email, user_name, password, display_name } = req.body;
    const userToUpdate = { email, user_name, password, display_name };

    const numberOfValues = Object.values(userToUpdate).filter(Boolean).length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'email', 'username', 'password' or 'display name'`
        }
      });

    return UsersService.hashPassword(password)
      .then(hashedPassword => {
        const protectedUser = {
          user_name,
          password: hashedPassword,
          email,
          display_name,
          date_created: 'now()',
        };

        UsersService.updateUser(
          req.app.get('db'),
          req.params.user_id,
          protectedUser
        )
          .then(numRowsAffected => {
            res.status(204).end();
          })
          .catch(next);
      });
  });

module.exports = usersRouter;
