'use strict';

const model = require('../utils/model');

module.exports = app => app.model.define('wxuser', model(app.Sequelize).wxuser);
