'use strict';

const Controller = require('egg').Controller;

class AuthwxController extends Controller {
  async authwx() {
    const { ctx } = this;
    const auth = await ctx.service.authwx.find(ctx.params.id);
    ctx.body = {
      errcode: 0,
      errmsg: 'get authwx success!',
      data: auth,
    };
    ctx.status = 200;
  }
}

module.exports = AuthwxController;
