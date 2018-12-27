'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  async user() {
    const { ctx } = this;
    const hashid = ctx.params.id;
    const id = ctx.helper.hashids.decode(hashid)[0];
    const { uid } = ctx.auth;
    // 只有本人能查询个人资料
    if (id !== +uid) {
      ctx.throw(501, 'auth err!');
    }
    const user = await ctx.service.user.find(id);
    user.id = ctx.helper.hashids.encode(user.id);
    ctx.body = {
      errcode: 0,
      errmsg: 'get success',
      data: user,
    };
    ctx.status = 200;
  }
}

module.exports = UserController;
