'use strict';

const model = require('../utils/model');

module.exports = app => app.model.define('user', model(app.Sequelize).user);
