'use strict';

const model = require('../utils/model');

module.exports = app => app.model.define('wxapp', model(app.Sequelize).wxapp);
