const UsersService = {
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
};

module.exports = UsersService;
