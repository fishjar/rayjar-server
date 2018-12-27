'use strict';

module.exports = appInfo => {
  const config = exports = {};

  config.sequelize = {
    dialect: 'mysql', // support: mysql, mariadb, postgres, mssql
    dialectOptions: {
      charset: 'utf8mb4',
    },
    database: 'wxapp',
    host: 'localhost',
    port: '3306',
    username: 'root',
    password: '******',
  };

  config.logger = {
    dir: '/data/log/wxapp/wx',
  };

  config.baseDir = '/data/www/media';

  return config;
};
