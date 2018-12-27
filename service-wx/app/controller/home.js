'use strict';

const Controller = require('egg').Controller;
const XML = require('pixl-xml');

class HomeController extends Controller {

  async index() {
    this.ctx.body = 'hi, egg';
  }

  async test() {
    const json = {
      a: 1,
      b: 2,
      ab: 3
    }
    this.ctx.body = XML.stringify(json, 'xml');
  }

  // 登录
  async login() {
    const { ctx } = this;
    const { appid, js_code } = ctx.request.body;
    if (!(appid && js_code)) {
      this.ctx.throw(501, 'missing params!');
    }
    const { secret } = await ctx.service.wxapp.findApp(appid);
    const { session_key, openid } = await ctx.service.wxapp.getSessionKey({ appid, secret, js_code });
    const wxuser = (await ctx.service.wxuser.findOrCreate({ appid, openid }))[0];
    // 更新 session_key 信息
    await ctx.service.wxuser.update(wxuser.id, {
      session_key,
    });
    delete wxuser.session_key; // 过滤 session_key 信息
    ctx.body = {
      data: wxuser,
      errcode: 0,
      errmsg: 'get user!',
    };
  }

  // 解密并更新用户资料
  async wxuser() {
    const { ctx } = this;
    const { wxuser_id, encryptedData, iv } = ctx.request.body;
    if (!(wxuser_id && encryptedData && iv)) {
      this.ctx.throw(501, 'missing params!');
    }
    const { appid, session_key } = await ctx.service.wxuser.find(wxuser_id);
    const {
      nickName,
      unionId,
      avatarUrl,
      gender,
      city,
      province,
      country,
    } = ctx.service.wxapp.encryData({
        appid,
        sessionKey: session_key,
        encryptedData,
        iv,
      });
    const wxuser = await ctx.service.wxuser.update(wxuser_id, {
      nickname: nickName,
      unionid: unionId,
      avatar: avatarUrl,
      gender,
      city,
      province,
      country,
    });
    ctx.body = {
      data: wxuser,
      errcode: 0,
      errmsg: 'update user info!',
    };
  }

  // 微信统一下单
  async unifiedorder() {
    const { ctx } = this;
    const body = ctx.request.body;
    // const body = {
    //   body: 'test',
    //   out_trade_no: Date.now(),
    //   total_fee: 1,
    //   spbill_create_ip: ctx.ip,
    //   trade_type: 'JSAPI',
    //   appid: 'wx7aacccc73ccea206',
    //   openid: 'o4pXt0ILIpIVIObuYG_JvunqP8JE'
    // };
    const wxpay = await ctx.service.wxpay.unifiedorder(body);
    ctx.body = {
      data: wxpay,
      errcode: 0,
      errmsg: 'create wxpay!',
    };
  }

  async payaction() {
    const { ctx } = this;
    ctx.body = await ctx.service.wxpay.payaction(ctx.request.body.xml);
  }

  // 获取 access_token
  async token() {
    const { ctx } = this;
    const access_token = await ctx.service.wxapp.getToken(ctx.params.appid);
    ctx.body = {
      data: access_token,
      errcode: 0,
      errmsg: 'get access_token!',
    };
  }

  // 获取二维码
  async wxcode() {
    const { ctx } = this;
    const { appid, ctype } = ctx.params;
    const { body } = ctx.request;
    const { url } = await ctx.service.wxapp.getWxcode({ appid, ctype, body });
    ctx.body = {
      data: {
        url,
      },
      errcode: 0,
      errmsg: 'get wxcode!',
    };
  }

}

module.exports = HomeController;
