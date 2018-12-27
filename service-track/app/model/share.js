'use strict';

const model = require('../utils/model');

module.exports = app => app.model.define('share', model(app.Sequelize).share);
