'use strict';

const Controller = require('egg').Controller;

const createRule = {
  track_type: 'int',
  user_id: 'int',
  // promocode: { type: 'string', required: false },
};

class RESTController extends Controller {

  async index() {
    const { ctx } = this;
    const data = await ctx.service.tracks.list(ctx.query);
    ctx.body = {
      errcode: 0,
      errmsg: 'get list success!',
      data,
    };
  }

  async create() {
    const { ctx } = this;
    ctx.validate(createRule);
    const data = await ctx.service.tracks.create(ctx.request.body);
    ctx.body = {
      errcode: 0,
      errmsg: 'create success!',
      data,
    };
  }

  async show() {
    const { ctx } = this;
    const data = await ctx.service.tracks.find(ctx.params.id);
    ctx.body = {
      errcode: 0,
      errmsg: 'get success!',
      data,
    };
  }

  async update() {
    const { ctx } = this;
    const body = ctx.request.body;
    const data = await ctx.service.tracks.update(ctx.params.id, body);
    ctx.body = {
      errcode: 0,
      errmsg: 'update success!',
      data,
    };
  }

  async destroy() {
    const { ctx } = this;
    const { id } = ctx.params;
    await ctx.service.tracks.del(id);
    ctx.body = {
      errcode: 0,
      errmsg: 'delete success!',
      data: { id },
    };
  }

}

module.exports = RESTController;
