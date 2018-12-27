'use strict';

const Controller = require('egg').Controller;

class WxmchController extends Controller {

  async wxmchs() {
    const { ctx } = this;
    const wxmchs = await ctx.service.wxmch.list(ctx.query);
    ctx.body = {
      errcode: 0,
      errmsg: 'get wxmchs success!',
      data: wxmchs,
    };
    ctx.status = 200;
  }

  async wxmch() {
    const { ctx } = this;
    const wxmch = await ctx.service.wxmch.find(ctx.params.id);
    ctx.body = {
      errcode: 0,
      errmsg: 'get wxmch success!',
      data: wxmch,
    };
    ctx.status = 200;
  }

  async create() {
    const { ctx } = this;
    const created = await ctx.service.wxmch.create(ctx.request.body);
    ctx.status = 201;
    ctx.body = created;
  }

}

module.exports = WxmchController;
