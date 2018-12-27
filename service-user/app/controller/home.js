'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {

  async index() {
    this.ctx.body = 'hi, egg';
  }

  async login() {
    const { ctx } = this;
    const { auth_type, wxuser } = ctx.request.body;
    if (!(auth_type && wxuser)) {
      ctx.throw(501, 'missing params!');
    }
    if (+auth_type === 4) {
      const auth = await ctx.service.authwx.findOne({ wxuser_id: wxuser.id });
      if (auth) {
        const user = await ctx.service.user.find(auth.user_id);
        ctx.body = {
          errcode: 0,
          errmsg: 'login && get user success!',
          data: {
            user,
            auth,
          },
        };
        ctx.status = 201;
      } else {
        const newUser = await ctx.service.user.create(wxuser);
        const newAuth = await ctx.service.authwx.create({ user_id: newUser.id, wxuser_id: wxuser.id });
        ctx.body = {
          errcode: 0,
          errmsg: 'login && create user success!',
          data: {
            user: newUser,
            auth: newAuth,
            isnew: true,
          },
        };
        ctx.status = 201;
      }
    } else {
      ctx.throw(501, 'auth_type err!');
    }
  }

}

module.exports = HomeController;
