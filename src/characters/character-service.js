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
        'char.class',
        ...userFields)
      //   db.raw(
      //     `count(DISTINCT rev) AS number_of_reviews`
      //   ),
      //   db.raw(
      //     `AVG(rev.rating) AS average_review_rating`
      //   )
      // )
      // .leftJoin(
      //   'thingful_reviews AS rev',
      //   'thg.id',
      //   'rev.thing_id'
      // )
      .leftJoin(
        'jurps_users AS usr',
        'char.user_id',
        'usr.id'
      )
      .groupBy('char.id', 'usr.id');
  },

  getById(db, id) {
    return characterService.getAllCharacters(db)
      .where('char.id', id)
      .first();
  },

  // getReviewsForCharacter(db, thing_id) {
  //   return db
  //     .from('thingful_reviews AS rev')
  //     .select(
  //       'rev.id',
  //       'rev.rating',
  //       'rev.text',
  //       'rev.date_created',
  //       ...userFields
  //     )
  //     .where('rev.thing_id', thing_id)
  //     .leftJoin(
  //       'thingful_users AS usr',
  //       'rev.user_id',
  //       'usr.id'
  //     )
  //     .groupBy('rev.id', 'usr.id');
  // },

  serializeCharacters(chars) {
    return chars.map(this.serializeCharacter);
  },

  serializeCharacter(char) {
    const charTree = new Treeize();

    const charData = charTree.grow([char]).getData()[0];

    return {
      id: charData.id,
      name: xss(charData.name),
      race: xss(charData.race),
      class: xss(charData.class),
      date_created: charData.date_created,
      user: charData.user || {},
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
