'use strict';

const co = require('co');
const model = require('../app/utils/model');

module.exports = {
  up: co.wrap(function* (db, Sequelize) {
    yield db.createTable('promos', model(Sequelize).promo);
    yield db.createTable('tracks', model(Sequelize).track);
    yield db.createTable('shares', model(Sequelize).share);
  }),

  down: co.wrap(function* (db) {
    yield db.dropTable('promos');
    yield db.dropTable('tracks');
    yield db.dropTable('shares');
  }),
};
