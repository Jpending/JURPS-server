/* eslint-disable no-console */
/* eslint-disable quotes */
const xss = require('xss');
const Treeize = require('treeize');

const characterService = {
  getAllCharacters(db) {
    return db
      .from('jurps_characters AS char')
      .select(
        'char.id',
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
        'char.user_id',
        ...userFields)
      .leftJoin(
        'jurps_users AS usr',
        'char.user_id',
        'usr.id'
      )
      .groupBy('char.id', 'usr.id');
  },
  getById(db, char_id) {
    console.log('   esegegseges    ' + char_id);
    return db
      .from('jurps_characters AS char')
      .select()
      .where('id', char_id)
      .first();
  },
  updateChar(knex, id, newCharFields) {
    return knex('jurps_characters')
      .where({ id })
      .update(newCharFields);
  },
  insertChar(knex, newChar) {
    return knex
      .insert(newChar)
      .into('jurps_characters')
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },
  deleteChar(knex, id) {
    return knex('jurps_characters')
      .where({ id })
      .delete();
  },
  serializeCharacters(chars) {
    return chars.map(this.serializeCharacter);
  },
  validatefield(field) {
    if (field.length < 2) {
      return `${field} must be longer than 2 characters`;
    }
    if (field.length > 300) {
      return '`{field} must be less than 300 characters`';
    }
    if (field.startsWith(' ') || field.endsWith(' ')) {
      return '`{field} must not start or end with empty spaces`';
    }
    return null;
  },
  serializeCharacter(char) {
    const charTree = new Treeize();
    const charData = charTree.grow([char]).getData()[0];
    return {
      cid: charData.id,
      id: charData.id,
      name: xss(charData.name),
      race: xss(charData.race),
      class: xss(charData.cclass),
      str: charData.strength,
      dex: charData.dexterity,
      int: charData.intelligence,
      health: charData.health,
      hp: charData.hit_points,
      will: charData.will,
      per: charData.perception,
      fp: charData.fatigue_points,
      abilities: xss(charData.abilities),
      story: xss(charData.background_story),
      date_created: charData.date_created,
      user_id: charData.user_id || {},
    };
  },

};

const userFields = [
  'usr.id AS user:id',
  'usr.user_name AS user:user_name',
  'usr.email AS user:email',
  'usr.date_created AS user:date_created',

];

module.exports = characterService;
