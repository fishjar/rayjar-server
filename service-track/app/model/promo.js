'use strict';

const model = require('../utils/model');

module.exports = app => app.model.define('promo', model(app.Sequelize).promo);
