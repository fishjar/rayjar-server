'use strict';

const Service = require('egg').Service;

class Wxmch extends Service {
  async list({ offset = 0, limit = 10, order_by = 'created_at', order = 'ASC' }) {
    return this.ctx.model.Wxmch.findAndCountAll({
      offset,
      limit,
      order: [[ order_by, order.toUpperCase() ]],
    });
  }

  async find(id) {
    const wxmch = await this.ctx.model.Wxmch.findById(id);
    if (!wxmch) {
      this.ctx.throw(404, 'wxmch not found');
    }
    return wxmch;
  }

  async create(wxmch) {
    return this.ctx.model.Wxmch.create(wxmch);
  }

  async update(id, updates) {
    const wxmch = await this.ctx.model.Wxmch.findById(id);
    if (!wxmch) {
      this.ctx.throw(404, 'wxmch not found');
    }
    return wxmch.update(updates);
  }

}

module.exports = Wxmch;
