'use strict';

const Controller = require('egg').Controller;

class WxpayController extends Controller {

  async wxpays() {
    const { ctx } = this;
    const wxpays = await ctx.service.wxpay.list(ctx.query);
    ctx.body = {
      errcode: 0,
      errmsg: 'get wxpays success!',
      data: wxpays,
    };
    ctx.status = 200;
  }

  async wxpay() {
    const { ctx } = this;
    const wxpay = await ctx.service.wxpay.find(ctx.params.id);
    ctx.body = {
      errcode: 0,
      errmsg: 'get wxpay success!',
      data: wxpay,
    };
    ctx.status = 200;
  }

  async create() {
    const { ctx } = this;
    const created = await ctx.service.wxpay.create(ctx.request.body);
    ctx.status = 201;
    ctx.body = created;
  }

}

module.exports = WxpayController;
