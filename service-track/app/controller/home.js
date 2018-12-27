'use strict';

const Controller = require('egg').Controller;

const promoRule = {
  user_id: 'int',
  promo_type: { type: 'int', required: false },
  appid: 'string',
};

class HomeController extends Controller {
  async index() {
    this.ctx.body = 'hi, egg';
  }

  async promo() {
    const { ctx } = this;
    ctx.validate(promoRule);
    const data = await ctx.service.promos.getPromo(ctx.request.body);
    ctx.body = {
      errcode: 0,
      errmsg: 'get promocode success!',
      data,
    };
  }
}

module.exports = HomeController;
