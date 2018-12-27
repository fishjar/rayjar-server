'use strict';

const Service = require('egg').Service;

class Wxpay extends Service {
  async list({ offset = 0, limit = 10, order_by = 'created_at', order = 'ASC' }) {
    return this.ctx.model.Wxpay.findAndCountAll({
      offset,
      limit,
      order: [[order_by, order.toUpperCase()]],
    });
  }

  async find(id) {
    const wxpay = await this.ctx.model.Wxpay.findById(id);
    if (!wxpay) {
      this.ctx.throw(404, 'wxpay not found');
    }
    return wxpay;
  }

  async findOne(options) {
    const wxpay = await this.ctx.model.Wxpay.findOne({ where: options });
    if (!wxpay) {
      return;
    }
    return wxpay;
  }

  async create(wxapp) {
    return this.ctx.model.Wxpay.create(wxapp);
  }

  async update(id, updates) {
    const wxpay = await this.ctx.model.Wxpay.findById(id);
    if (!wxpay) {
      this.ctx.throw(404, 'wxpay not found');
    }
    return wxpay.update(updates);
  }

  async unifiedorder(args) {
    const { ctx, config } = this;
    const { appid } = args;
    const { wxmch_id } = await ctx.service.wxapp.findApp(appid);
    const { mchid, secret } = await ctx.service.wxmch.find(wxmch_id);
    const { unifiedorder_host, notify_url } = config;
    const nonce_str = Math.random().toString(36).substr(2, 16);
    const signObj = Object.assign({
      mch_id: mchid,
      nonce_str,
      notify_url,
    }, args);
    const sign = ctx.helper.wxSign(signObj, secret);
    const xml = ctx.helper.json2xml(Object.assign({ sign }, signObj));
    const r = await ctx.curl(unifiedorder_host, {
      method: 'POST',
      content: xml,
      headers: {
        'content-type': 'text/html',
      },
    });
    const res = ctx.helper.xml2json(r.data);
    if (res.return_code !== 'SUCCESS' || res.result_code !== 'SUCCESS') {
      this.ctx.throw(500, `wxpay err! [${res.err_code}]: ${res.err_code_des}`);
    }
    const checkSign = ctx.helper.wxSign(res, secret);
    if (res.sign !== checkSign) {
      this.ctx.throw(500, `wxpay err! sign err!!`);
    }
    const wxpay = await ctx.service.wxpay.create(Object.assign({ sign }, signObj, res));
    // return wxpay
    const data = {
      appId: appid,
      timeStamp: `${~~(Date.now() / 1000)}`,
      nonceStr: Math.random().toString(36).substr(2, 16),
      package: `prepay_id=${res.prepay_id}`,
      signType: 'MD5',
    }
    const paySign = ctx.helper.wxSign(data, secret);
    return Object.assign(data, { paySign });
  }

  async payaction(body) {
    const { ctx } = this;
    const res = ctx.helper.xml2json(body);

    if (res.return_code !== 'SUCCESS' || res.result_code !== 'SUCCESS') {
      return ctx.helper.json2xml({
        return_code: 'FAIL',
        return_msg: res.return_msg
      })
    }

    const wxpay = await ctx.service.wxpay.findOne({ out_trade_no: res.out_trade_no });
    if (!wxpay) {
      return ctx.helper.json2xml({
        return_code: 'FAIL',
        return_msg: 'out_trade_no not exist!'
      })
    }

    const { wxmch_id } = await ctx.service.wxapp.findApp(appid);
    const { mchid, secret } = await ctx.service.wxmch.find(wxmch_id);
    if (mchid !== res.mch_id) {
      return ctx.helper.json2xml({
        return_code: 'FAIL',
        return_msg: 'mchid err!'
      })
    }
    const checkSign = ctx.helper.wxSign(res, secret);
    if (checkSign !== res.sign) {
      return ctx.helper.json2xml({
        return_code: 'FAIL',
        return_msg: 'sign err!'
      })
    }

    await ctx.service.wxpay.update(wxpay.id, Object.assign({
      trade_state: 'SUCCESS',
      trade_state_desc: 'update by action'
    }, res))

    return ctx.helper.json2xml({
      return_code: 'SUCCESS',
      return_msg: ''
    });
  }

}

module.exports = Wxpay;
