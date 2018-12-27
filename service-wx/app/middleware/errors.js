'use strict';

module.exports = options => {
  return async function errors(ctx, next) {
    try {
      await next();
      // ctx.logger.info('ok');
    } catch (err) {
      // ctx.logger.error(ctx.auth);
      // ctx.logger.error(err);
      // ctx.status = err.status || 400;
      // ctx.body = JSON.stringify({
      //   errcode: `${err.code || 100}`,
      //   errmsg: `${err.msg || err.message}`,
      // });

      // 所有的异常都在 app 上触发一个 error 事件，框架会记录一条错误日志
      ctx.app.emit('error', err, ctx);

      const status = err.status || 500;
      // 生产环境时 500 错误的详细错误内容不返回给客户端，因为可能包含敏感信息
      const error = status === 500 && ctx.app.config.env === 'prod'
        ? 'Internal Server Error'
        : err.message;

      // 从 error 对象上读出各个属性，设置到响应中
      ctx.body = {
        errcode: 100,
        errmsg: error
      };
      if (status === 422) {
        ctx.body = {
          errcode: 102,
          errmsg: err.errors
        };
      }
      ctx.status = status;
    }
  };
};
