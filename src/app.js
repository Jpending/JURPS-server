/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const errorHandler = require('./error-handler');
const authRouter = require('./auth/auth-router');
const characterRouter = require('./characters/character-router');
const usersRouter = require('./Users/users-router');

const app = express();

app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
  skip: () => NODE_ENV === 'test',
}));

app.use(errorHandler);
app.use(helmet());
app.use(cors());
app.use('/api/auth', authRouter);
app.use('/api/Characters', characterRouter);
app.use('/api/Users', usersRouter);

app.get('/', (req, res) => {
  res.send('Hello, boilerplate!');
});

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});



module.exports = app;
