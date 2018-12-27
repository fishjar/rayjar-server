'use strict';

module.exports = appInfo => {
  const config = exports = {};
  const _host = '127.0.0.1';

  // 启动配置
  config.cluster = {
    listen: {
      port: 9026,
      hostname: _host,
    },
  };

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1525661750583_1751';

  // add your config here
  // config.middleware = [];
  config.middleware = ['auth', 'errors'];

  config.email = {
    host: 'smtp.exmail.qq.com',
    port: 465,
    secure: true,
    auth: {
      user: 'test@test.com',
      pass: '******',
    }
  };

  config.security = {
    csrf: {
      // 判断是否需要 ignore 的方法，请求上下文 context 作为第一个参数
      // ignore: ctx => isInnerIp(ctx.ip),
      ignore: ctx => ctx.ip === '127.0.0.1',
      // enable: false,
    },
  };

  return config;
};
