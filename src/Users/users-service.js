/* eslint-disable no-useless-escape */
const bcrypt = require('bcryptjs');
const xss = require('xss');


const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;
const REGEX_SPECIAL = /(?=.*[a-z])(?=.*[!@#\$%\^&])[\S]+/;


const UsersService = {
  hasUserWithUserName(db, user_name) {
    return db('jurps_users')
      .where({ user_name })
      .first()
      .then(user => !!user);
  },

  getUserChars(knex, user_id) {
    return knex
      .select('char.id',
        'char.name',
        'char.date_created',
        'char.race',
        'char.cclass',
        'char.strength',
        'char.dexterity',
        'char.intelligence',
        'char.health',
        'char.hit_points',
        'char.will',
        'char.perception',
        'char.fatigue_points',
        'char.abilities',
        'char.background_story',
        ...userFields)
      .leftJoin(
        'jurps_users AS usr',
        'char.user_id',
        'usr.id'
      )

      .from('jurps_characters as char')
      .where('char.user_id', user_id);
  },

  getAllUsers(knex) {
    return knex.select('*').from('jurps_users');
  },

  insertUser(knex, newUser) {
    return knex
      .insert(newUser)
      .into('jurps_users')
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },

  getById(knex, id) {
    return knex
      .from('jurps_users')
      .select('*')
      .where('id', id)
      .first();
  },

  deleteUser(knex, id) {
    return knex('jurps_users')
      .where({ id })
      .delete();
  },

  updateUser(knex, id, newUserFields) {
    return knex('jurps_users')
      .where({ id })
      .update(newUserFields);
  },
  validateEmail(email) {
    if (email.length < 9) {
      return 'Email must be longer than 9 characters';
    }
    if (email.length > 72) {
      return 'Email must be less than 72 characters';
    }
    if (email.startsWith(' ') || email.endsWith(' ')) {
      return 'Username must not start or end with empty spaces';
    }
    if (!REGEX_SPECIAL.test(email)) {
      return 'Email must be in the format of "Email@domain.com"';
    }

    return null;
  },
  validateDisplayName(display_name) {
    if (display_name.length < 4) {
      return 'Display name must be longer than 4 characters';
    }
    if (display_name.length > 72) {
      return 'Display name must be less than 72 characters';
    }
    if (display_name.startsWith(' ') || display_name.endsWith(' ')) {
      return 'Display name must not start or end with empty spaces';
    }
    return null;
  },
  validateUserName(user_name) {
    if (user_name.length < 8) {
      return 'Username must be longer than 8 characters';
    }
    if (user_name.length > 72) {
      return 'Username must be less than 72 characters';
    }
    if (user_name.startsWith(' ') || user_name.endsWith(' ')) {
      return 'Username must not start or end with empty spaces';
    }
    return null;
  },
  validatePassword(password) {
    if (password.length < 8) {
      return 'Password must be longer than 8 characters';
    }
    if (password.length > 72) {
      return 'Password must be less than 72 characters';
    }
    if (password.startsWith(' ') || password.endsWith(' ')) {
      return 'Password must not start or end with empty spaces';
    }
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return 'Password must contain one upper case, lower case, number and special character';
    }
    return null;
  },

  hashPassword(password) {
    return bcrypt.hash(password, 4);
  },
  serializeUser(user) {
    return {
      id: user.id,
      email: xss(user.email),
      user_name: xss(user.user_name),
      display_name: xss(user.display_name),
      date_created: new Date(user.date_created),
    };
  }
};
const userFields = [
  'usr.id AS user:id',
  'usr.user_name AS user:user_name',
  'usr.email AS user:email',
  'usr.date_created AS user:date_created',

];
module.exports = UsersService;
