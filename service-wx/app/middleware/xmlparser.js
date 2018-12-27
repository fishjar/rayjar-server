'use strict';

const contentType = require('content-type');
const getRawBody = require("raw-body");

module.exports = options => {
  return async function xmlparser(ctx, next) {

    if (ctx.method === 'POST' && ctx.request.header["content-type"] === 'text/xml') {
      const buff = await getRawBody(ctx.request.req, {
        encoding: contentType.parse(ctx.req).parameters.charset
      });
      ctx.request.body.xml = buff;
    }

    await next();
  };
};
