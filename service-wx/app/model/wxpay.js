'use strict';

const model = require('../utils/model');

module.exports = app => app.model.define('wxpay', model(app.Sequelize).wxpay);
