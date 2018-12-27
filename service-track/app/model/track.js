'use strict';

const model = require('../utils/model');

module.exports = app => app.model.define('track', model(app.Sequelize).track);
