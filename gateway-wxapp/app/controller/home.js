'use strict';

const Controller = require('egg').Controller;
const FromStream = require('formstream');

class HomeController extends Controller {

  // 测试
  async test() {
    const { ctx } = this;
    ctx.body = {
      errcode: 0,
      errmsg: 'get success',
      data: 'test data! ',
    }
  }

  // 登录
  async login() {
    const { ctx } = this;
    const { code } = ctx.request.body;
    const { authentication, appid } = ctx.request.header;
    if (!(appid && code)) {
      ctx.throw(501, 'missing params!');
    }
    const { auth, user, isnew } = await ctx.service.home.login({ appid, js_code: code });
    const { token, expire } = await ctx.service.home.flashToken({ aid: auth.id, uid: auth.user_id });
    await ctx.service.home.flushToken(authentication);
    user.id = ctx.helper.hashids.encode(user.id); // hashids处理
    ctx.body = {
      errcode: 0,
      errmsg: 'login success',
      data: {
        user,
        isnew,
        token,
        expire,
      },
    };
  }

  // 解密并更新用户资料
  async wxuser() {
    const { ctx } = this;
    const { encryptedData, iv } = ctx.request.body;
    if (!(encryptedData && iv)) {
      ctx.throw(501, 'missing params!');
    }
    const { aid } = ctx.auth;
    const { user } = await ctx.service.home.wxuser({ aid, encryptedData, iv });
    user.id = ctx.helper.hashids.encode(user.id);
    ctx.body = {
      errcode: 0,
      errmsg: 'get and update success',
      data: user,
    };
  }

  // 获取推广码
  async promo() {
    const { ctx, config } = this;
    const { appid } = ctx.request.header;
    const {
      page,
      promo_type,
      promocode,
      wxbcode,
      user_id,
    } = await ctx.API(`${config.msapi.track}/promo`, {
        method: 'POST',
        data: {
          appid,
          user_id: ~~ctx.auth.uid,
        },
      });

    ctx.body = {
      errcode: 0,
      errmsg: 'get promo success',
      data: {
        page,
        promo_type,
        promocode,
        wxbcode: `${config.mediaHost}${wxbcode}`,
        user_id: ctx.helper.hashids.encode(user_id),
      },
    };
  }

  // 上报推广码使用
  async tracks() {
    const { ctx, config } = this;
    const body = ctx.request.body;
    // body.user_id = ctx.helper.hashids.decode(body.user_id)[0];
    body.user_id = ~~ctx.auth.uid
    const {
      scene,
      promocode,
      track_type,
      detail,
    } = await ctx.API(`${config.msapi.track}/tracks`, {
        method: 'POST',
        data: body,
      });

    ctx.body = {
      errcode: 0,
      errmsg: 'create tracks success',
      data: {
        scene,
        promocode,
        track_type,
        detail,
      },
    };
  }

  // 上报转发
  async shares() {
    const { ctx, config } = this;
    const body = ctx.request.body;
    // body.user_id = ctx.helper.hashids.decode(body.user_id)[0];
    body.user_id = ~~ctx.auth.uid
    const {
      page,
      share_type,
    } = await ctx.API(`${config.msapi.track}/shares`, {
        method: 'POST',
        data: body,
      });

    ctx.body = {
      errcode: 0,
      errmsg: 'create shares success',
      data: {
        page,
        share_type,
      },
    };
  }

  // 获取留言列表
  async rjmsgList() {
    const { ctx, config } = this;
    const { appid } = ctx.request.header;
    const user_id = ~~ctx.auth.uid;
    if (!(appid && user_id)) {
      ctx.throw(401, 'missing params!');
    }
    const { page = 1 } = ctx.query;
    const limit = 10;
    const offset = (page - 1) * limit;
    const url = ctx.helper.generateHref(`${config.msapi.biz}/rjmsgs`, {
      order: 'DESC',
      appid,
      user_id,
      offset,
      limit,
    });
    const res = await ctx.API(url);
    res.rows.forEach(item => {
      item.id = ctx.helper.hashids.encode(item.id);
      item.pid = ctx.helper.hashids.encode(item.pid);
      delete item.appid;
    });
    res.page = ~~page;
    const pages = ~~(res.count / limit);
    res.pages = (res.count % limit) === 0 ? pages : pages + 1;

    ctx.body = {
      errcode: 0,
      errmsg: 'get msgs success',
      data: res,
    };
  }

  async rjmsgList2() {
    const { ctx, config } = this;
    const { appid } = ctx.request.header;
    const user_id = ~~ctx.auth.uid;
    if (!(appid && user_id)) {
      ctx.throw(401, 'missing params!');
    }
    const { page = 1 } = ctx.query;
    const limit = 10;
    const offset = (page - 1) * limit;
    const url = ctx.helper.generateHref(`${config.msapi.biz}/rjmsgs`, {
      order: 'DESC',
      appid,
      user_id,
      offset,
      limit,
    });
    const res = await ctx.API(url);
    res.rows.forEach(item => {
      item.id = ctx.helper.hashids.encode(item.id);
      item.pid = ctx.helper.hashids.encode(item.pid);
      delete item.appid;
    });
    res.page = ~~page;
    const pages = ~~(res.count / limit);
    res.pages = (res.count % limit) === 0 ? pages : pages + 1;

    ctx.body = {
      errcode: 0,
      errmsg: 'get msgs success',
      data: res,
    };
  }

  // 创建留言
  async rjmsgCreate() {
    const { ctx, config } = this;
    const { appid } = ctx.request.header;
    const {
      pid,
      name,
      email,
      phone,
      cont,
      ext,
    } = ctx.request.body;
    if (!(appid && cont)) {
      ctx.throw(501, 'missing params!');
    }
    const user_id = ~~ctx.auth.uid;
    const {
      id,
      created_at,
    } = await ctx.API(`${config.msapi.biz}/rjmsgs`, {
        method: 'POST',
        data: {
          user_id,
          pid,
          appid,
          name,
          email,
          phone,
          cont,
          ext,
        },
      });

    const msgDetail = [
      `${cont}`,
      `-------------------------------`,
      `留言时间：${ctx.helper.formatTime(created_at)}`,
      `用户ID：${user_id}`,
      `称呼：${name}`,
      `电话：${phone}`,
      `邮箱：${email}`,
      `附件：${ext || ''}`,
    ];
    const user = await ctx.service.user.find(user_id) || {};
    // const genders = ['-', '男', '女'];
    const userDetail = [
      `-------------------------------`,
      `uuid：${user.uuid}`,
      `name：${user.name || ''}`,
      `nickname：${user.nickname || ''}`,
      `avatar：${user.avatar || ''}`,
      // `gender：${genders[user.gender || 0]}`,
      `gender：${user.gender || ''}`,
      `city：${user.city || ''}`,
      `province：${user.province || ''}`,
      `country：${user.country || ''}`,
      `created_at：${ctx.helper.formatTime(user.created_at)}`,
      `updated_at：${ctx.helper.formatTime(user.updated_at)}`,
    ];
    await ctx.API(`${config.msapi.msg}/email`, {
      method: 'POST',
      data: {
        "to": config.receivers.join(', '),
        "subject": `[WXAPP] 收到新的留言`,
        "text": [...msgDetail, ...userDetail].join('\n'),
      },
    });

    ctx.body = {
      errcode: 0,
      errmsg: 'create rjmsgs success',
      data: {
        id: ctx.helper.hashids.encode(id),
        name,
        email,
        phone,
        cont,
        ext,
        created_at,
      },
    };
  }

}

module.exports = HomeController;
