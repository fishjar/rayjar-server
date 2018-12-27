'use strict';

const Service = require('egg').Service;

class Wxuser extends Service {
  async list({ offset = 0, limit = 10, order_by = 'created_at', order = 'ASC' }) {
    return this.ctx.model.Wxuser.findAndCountAll({
      offset,
      limit,
      order: [[ order_by, order.toUpperCase() ]],
    });
  }

  async find(id) {
    const wxuser = await this.ctx.model.Wxuser.findById(id);
    if (!wxuser) {
      this.ctx.throw(404, 'wxuser not found');
    }
    return wxuser;
  }

  async findOrCreate(options) {
    return this.ctx.model.Wxuser.findOrCreate({ where: options });
  }

  async create(wxuser) {
    return this.ctx.model.Wxuser.create(wxuser);
  }

  async update(id, updates) {
    const wxuser = await this.ctx.model.Wxuser.findById(id);
    if (!wxuser) {
      this.ctx.throw(404, 'wxuser not found');
    }
    return wxuser.update(updates);
  }

  async findOne(options) {
    const wxuser = await this.ctx.model.Wxuser.findOne({ where: options });
    if (!wxuser) {
      return;
    }
    return wxuser;
  }
}

module.exports = Wxuser;
