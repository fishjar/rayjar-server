'use strict';

module.exports = options => {
  return async function auth(ctx, next) {
    if (ctx.ip !== '127.0.0.1') {
      ctx.throw(401, 'not safe ip!');
    }
    await next();
  };
};
