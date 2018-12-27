'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {

  async user() {
    const { ctx } = this;
    const user = await ctx.service.user.find(ctx.params.id);
    ctx.body = {
      errcode: 0,
      errmsg: 'get user success!',
      data: user,
    };
  }

  async update() {
    const { ctx } = this;
    const userInfo = ctx.request.body;
    const user = await ctx.service.user.update(ctx.params.id, userInfo);
    ctx.body = {
      errcode: 0,
      errmsg: 'update user success!',
      data: user,
    };
  }

}

module.exports = UserController;
