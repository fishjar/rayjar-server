'use strict';

const model = require('../utils/model');

module.exports = app => app.model.define('wxmch', model(app.Sequelize).wxmch, { tableName: 'wxmchs' });
