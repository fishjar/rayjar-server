'use strict';

const co = require('co');
const model = require('../app/utils/model');

module.exports = {
  up: co.wrap(function* (db, Sequelize) {
    yield db.createTable('users', model(Sequelize).user);
    yield db.createTable('authwxs', model(Sequelize).authwx);
  }),

  down: co.wrap(function* (db) {
    yield db.dropTable('users');
    yield db.dropTable('authwxs');
  }),
};
