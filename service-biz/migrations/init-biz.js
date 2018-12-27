'use strict';

const co = require('co');
const model = require('../app/utils/model');

module.exports = {
  up: co.wrap(function* (db, Sequelize) {
    yield db.createTable('rjmsgs', model(Sequelize).rjmsg);
  }),

  down: co.wrap(function* (db) {
    yield db.dropTable('rjmsgs');
  }),
};
