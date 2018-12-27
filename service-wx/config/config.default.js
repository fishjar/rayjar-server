'use strict';

module.exports = appInfo => {
  const config = exports = {};
  const _host = '127.0.0.1';

  // 启动配置
  config.cluster = {
    listen: {
      port: 9023,
      hostname: _host,
    },
  };

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1517215058546_3015';

  // add your config here
  // config.middleware = [];
  config.middleware = ['auth', 'xmlparser', 'errors'];

  config.token_host = 'https://api.weixin.qq.com/cgi-bin/token';
  config.jscode_host = 'https://api.weixin.qq.com/sns/jscode2session';
  config.unifiedorder_host = 'https://api.mch.weixin.qq.com/pay/unifiedorder';
  config.notify_url = 'http://api.test.com/pay/action';
  config.wxcode_host = {
    a: 'https://api.weixin.qq.com/wxa/getwxacode',
    b: 'https://api.weixin.qq.com/wxa/getwxacodeunlimit',
    c: 'https://api.weixin.qq.com/cgi-bin/wxaapp/createwxaqrcode',
  };

  config.baseDir = '/home/gabe/tmp/egg';

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
    // domainWhiteList: ['http://localhost:9101'],
  };

  // config.cors = {
  //   origin: '127.0.0.1',
  //   allowMethods: 'GET'
  // };

  return config;
};
