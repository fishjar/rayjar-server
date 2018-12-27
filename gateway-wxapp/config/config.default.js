'use strict';

module.exports = appInfo => {
  const config = exports = {};
  const _host = '127.0.0.1';

  // 启动配置
  config.cluster = {
    listen: {
      port: 9020,
      hostname: _host,
    },
  };

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1517215126304_8672';

  // add your config here
  // config.middleware = [];
  // config.middleware = ['errors'];
  config.middleware = [ 'auth', 'errors' ];

  // config.expire_offset = 60 * 60 * 24 * 3; // 3天过期
  // config.expire_offset = 60 * 3; // 3分钟过期
  config.expire_offset = 60 * 60; // 一小时过期

  config.msapi = {
    biz: `http://${_host}:9021`,
    user: `http://${_host}:9022`,
    wx: `http://${_host}:9023`,
    media: `http://${_host}:9024`,
    track: `http://${_host}:9025`,
    msg: `http://${_host}:9026`,
  };

  config.redis = {
    client: {
      port: 6379, // Redis port
      host: '127.0.0.1', // Redis host
      password: null,
      db: 0,
    },
  };

  config.security = {
    csrf: {
      // 判断是否需要 ignore 的方法，请求上下文 context 作为第一个参数
      // ignore: ctx => isInnerIp(ctx.ip),
      enable: false,
    },
  };

  config.mediaHost = 'https://media.test.com';

  config.receivers = [
    "******@gmail.com",
  ];

  return config;
};
