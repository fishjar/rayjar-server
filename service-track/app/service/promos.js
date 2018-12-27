'use strict';

const Service = require('egg').Service;

class RESTService extends Service {

  async list({ offset = 0, limit = 10, order_by = 'created_at', order = 'ASC' }) {
    return this.ctx.model.Promo.findAndCountAll({
      offset,
      limit,
      order: [[order_by, order.toUpperCase()]],
    });
  }

  async find(id) {
    const res = await this.ctx.model.Promo.findById(id);
    if (!res) {
      this.ctx.throw(404, 'Promo not found');
    }
    return res;
  }

  async findOne(options) {
    return this.ctx.model.Promo.findOne({ where: options });
  }

  async create(params) {
    return this.ctx.model.Promo.create(params);
  }

  async update(id, updates) {
    const res = await this.ctx.model.Promo.findById(id);
    if (!res) {
      this.ctx.throw(404, 'Promo not found');
    }
    return res.update(updates);
  }

  async del(id) {
    const res = await this.ctx.model.Promo.findById(id);
    if (!res) {
      this.ctx.throw(404, 'Promo not found');
    }
    return res.destroy();
  }

  async getPromo({ user_id, promo_type = 1, appid, page = 'pages/index/index' }) {
    const { ctx, config } = this;
    let data = await this.findOne({ user_id, promo_type, appid });
    if (!data) {
      const promocode = ctx.helper.hashids.encode(user_id);
      const wxcode_api = `${config.msapi.wx}/wxcode/${appid}/a`;
      const path = `${page}?promo=${promocode}`;
      const res = await ctx.curl(wxcode_api, {
        method: 'POST',
        dataType: 'json',
        // data: {
        //   page,
        //   scene: promocode,
        // },
        data: {
          path,
        },
      });
      if (res.data.errcode !== 0) {
        this.ctx.throw(500, res.data.errmsg);
      }
      data = await this.create({
        user_id,
        promo_type,
        appid,
        promocode,
        wxbcode: res.data.data.url,
        page: path,
      });
    }
    return data;
  }

}

module.exports = RESTService;
