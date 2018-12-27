'use strict';

const Service = require('egg').Service;
const WXBizDataCrypt = require('../utils/WXBizDataCrypt');
const crypto = require('crypto');

class Wxapp extends Service {
  async list({ offset = 0, limit = 10, order_by = 'created_at', order = 'ASC' }) {
    return this.ctx.model.Wxapp.findAndCountAll({
      offset,
      limit,
      order: [[order_by, order.toUpperCase()]],
    });
  }

  async find(id) {
    const wxapp = await this.ctx.model.Wxapp.findById(id);
    if (!wxapp) {
      this.ctx.throw(404, 'wxapp not found');
    }
    return wxapp;
  }

  async create(wxapp) {
    return this.ctx.model.Wxapp.create(wxapp);
  }

  async update(id, updates) {
    const wxapp = await this.ctx.model.Wxapp.findById(id);
    if (!wxapp) {
      this.ctx.throw(404, 'wxapp not found');
    }
    return wxapp.update(updates);
  }

  async findApp(appid) {
    const wxapp = await this.ctx.model.Wxapp.findOne({ where: { appid } });
    if (!wxapp) {
      this.ctx.throw(404, 'wxapp not found');
    }
    return wxapp;
  }

  async getSessionKey({ appid, secret, js_code, grant_type = 'authorization_code' }) {
    const { ctx } = this;
    const jscode_host = this.config.jscode_host;
    const res = await ctx.curl(ctx.helper.generateHref(jscode_host, {
      appid,
      secret,
      js_code,
      grant_type,
    }), {
        dataType: 'json',
      });
    if (res.data.errmsg) {
      ctx.throw(404, res.data.errmsg);
    }
    return res.data;
  }

  encryData({ appid, sessionKey, encryptedData, iv }) {
    const pc = new WXBizDataCrypt(appid, sessionKey);
    const data = pc.decryptData(encryptedData, iv);
    return data;
  }

  async getToken(appid) {
    const { ctx, config } = this;
    const wxapp = await this.findApp(appid);
    let { access_token, expires_in } = wxapp;
    const now = new Date().getTime() / 1000;
    expires_in = new Date(expires_in).getTime() / 1000;
    if (access_token && expires_in > now) {
      return access_token;
    }

    const token_host = config.token_host;
    const grant_type = 'client_credential';
    const { id, secret } = wxapp;
    const res = await ctx.curl(ctx.helper.generateHref(token_host, {
      appid,
      secret,
      grant_type,
    }), { dataType: 'json' });
    if (res.data.errmsg) {
      ctx.throw(500, res.data.errmsg);
    }
    expires_in = new Date().getTime() + res.data.expires_in;
    access_token = res.data.access_token;
    await this.update(id, {
      expires_in,
      access_token,
    });
    return access_token;
  }

  async getWxcode({ appid, body, ctype = 'b' }) {
    const { ctx, config } = this;
    const access_token = await this.getToken(appid);
    const wxcode_host = config.wxcode_host[ctype];
    const api_url = ctx.helper.generateHref(wxcode_host, {
      access_token,
    });
    const res = await ctx.curl(api_url, {
      method: 'POST',
      data: JSON.stringify(body),
    });
    if (!(res.status === 200 && res.headers['content-type'] === 'image/jpeg')) {
      ctx.throw(500, 'curl wxcode host err!');
    }
    const hashname = crypto.createHash('md5').update(res.data).digest('hex');
    const path = `${config.baseDir}/wxcode/${ctype}/${hashname}.jpg`;
    // const url = `${config.baseUrl}/wxcode/${ctype}/${hashname}.jpg`;
    const url = `/wxcode/${ctype}/${hashname}.jpg`;
    await ctx.helper.createFile(path, res.data);
    return { url, path };
  }

}

module.exports = Wxapp;
