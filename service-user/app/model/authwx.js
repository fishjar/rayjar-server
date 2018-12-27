'use strict';

const model = require('../utils/model');

module.exports = app => app.model.define('authwx', model(app.Sequelize).authwx, { tableName: 'authwxs' });
