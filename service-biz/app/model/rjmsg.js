'use strict';

const model = require('../utils/model');

module.exports = app => app.model.define('rjmsg', model(app.Sequelize).rjmsg);
