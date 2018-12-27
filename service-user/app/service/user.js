'use strict';

const uuidv1 = require('uuid/v1');
const Service = require('egg').Service;

class User extends Service {
  async list({ offset = 0, limit = 10, order_by = 'created_at', order = 'ASC' }) {
    return this.ctx.model.User.findAndCountAll({
      offset,
      limit,
      order: [[order_by, order.toUpperCase()]],
    });
  }

  async find(id) {
    const user = await this.ctx.model.User.findById(id);
    if (!user) {
      this.ctx.throw(404, 'user not found');
    }
    return user;
  }

  async create(user) {
    const uuid = uuidv1();
    const {
      name,
      nickname,
      mobile,
      email,
      gender,
      birthday,
      avatar,
      city,
      province,
      country,
    } = user
    return this.ctx.model.User.create({
      uuid,
      name,
      nickname,
      mobile,
      email,
      gender,
      birthday,
      avatar,
      city,
      province,
      country,
    });
  }

  async update(id, updates) {
    const user = await this.ctx.model.User.findById(id);
    if (!user) {
      this.ctx.throw(404, 'user not found');
    }
    const {
      name,
      nickname,
      avatar,
      gender,
      city,
      province,
      country,
    } = updates;
    return user.update({
      name,
      nickname,
      avatar,
      gender,
      city,
      province,
      country,
    });
  }

  async del(id) {
    const user = await this.ctx.model.User.findById(id);
    if (!user) {
      this.ctx.throw(404, 'user not found');
    }
    return user.destroy();
  }
}

module.exports = User;
