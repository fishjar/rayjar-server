'use strict';

const Service = require('egg').Service;

class RESTService extends Service {

  async list({ offset = 0, limit = 10, order_by = 'created_at', order = 'ASC', ...where }) {
    // console.log({ where })
    return this.ctx.model.Rjmsg.findAndCountAll({
      offset: ~~offset,
      limit: ~~limit,
      order: [[order_by, order.toUpperCase()]],
      where,
    });
  }

  async find(id) {
    const res = await this.ctx.model.Rjmsg.findById(id);
    if (!res) {
      this.ctx.throw(404, 'Rjmsg not found');
    }
    return res;
  }

  async findOne(options) {
    return this.ctx.model.Rjmsg.findOne({ where: options });
  }

  async create(params) {
    return this.ctx.model.Rjmsg.create(params);
  }

  async update(id, updates) {
    const res = await this.ctx.model.Rjmsg.findById(id);
    if (!res) {
      this.ctx.throw(404, 'Rjmsg not found');
    }
    return res.update(updates);
  }

  async del(id) {
    const res = await this.ctx.model.Rjmsg.findById(id);
    if (!res) {
      this.ctx.throw(404, 'Rjmsg not found');
    }
    return res.destroy();
  }

}

module.exports = RESTService;
