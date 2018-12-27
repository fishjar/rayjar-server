'use strict';

module.exports = appInfo => {
  const config = exports = {};
  const _host = '127.0.0.1';

  // 启动配置
  config.cluster = {
    listen: {
      port: 9025,
      hostname: _host,
    },
  };

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1523415330196_7243';

  // add your config here
  // config.middleware = [];
  config.middleware = ['auth', 'errors'];

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

  config.security = {
    csrf: {
      // 判断是否需要 ignore 的方法，请求上下文 context 作为第一个参数
      // ignore: ctx => isInnerIp(ctx.ip),
      ignore: ctx => ctx.ip === '127.0.0.1',
      // enable: false,
    },
  };

  config.msapi = {
    wx: `${_host}:9023`,
  };

  return config;
};
