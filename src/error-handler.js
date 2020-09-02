/* eslint-disable no-console */
/* eslint-disable no-unused-vars */

const { NODE_ENV } = require('./config');
const logger = require('./logger');

module.exports = function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    console.error(error);
    logger.error(error.message);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
};
