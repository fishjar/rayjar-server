'use strict';

const Service = require('egg').Service;
const crypto = require('crypto');

class Home extends Service {

  async getAuth(token) {
    const { app } = this;
    return await app.redis.hgetall(`auth:${token}`);
  }

  async login({ appid, js_code }) {
    const { ctx, config } = this;
    const wxuser = await ctx.API(`${config.msapi.wx}/login`, {
      method: 'POST',
      data: {
        appid,
        js_code,
      },
    });
    const { user, auth, isnew } = await ctx.API(`${config.msapi.user}/login`, {
      method: 'POST',
      data: {
        auth_type: 4,
        wxuser,
      },
    });
    if (isnew) {
      // 新用户
      return { wxuser, user, auth, isnew };
    }
    return { wxuser, user, auth };
  }

  async wxuser({ aid, encryptedData, iv }) {
    const { ctx, config } = this;
    const { wxuser_id, user_id } = await ctx.API(`${config.msapi.user}/authwx/${aid}`);
    const wxuser = await ctx.API(`${config.msapi.wx}/wxuser`, {
      method: 'POST',
      data: {
        wxuser_id,
        encryptedData,
        iv,
      },
    });
    const user = await ctx.API(`${config.msapi.user}/users/${user_id}`, {
      method: 'PUT',
      data: wxuser,
    });
    return { wxuser, user };
  }

  async flashToken({ aid, uid, atype = 4 }) {
    const { ctx, app, config } = this;
    const now = ~~(Date.now() / 1000);
    const expire = now + config.expire_offset;
    const token = this.generateToken({ aid, uid, atype, expire });
    const key = `auth:${token}`;
    const obj = {
      aid,
      uid,
      atype,
      expire,
    };
    await app.redis.hmset(key, ctx.helper.obj2arr(obj));
    await app.redis.expire(key, config.expire_offset);
    console.log('----------auth------------');
    console.log({ key });
    console.log(await app.redis.hgetall(key));
    ctx.auth = obj; // 更新全局变量
    return { token, expire };
  }

  async flushToken(token) {
    const { app } = this;
    return app.redis.del(`auth:${token}`);
  }

  async deferToken(token) {
    const { app, config } = this;
    const key = `auth:${token}`;
    const now = ~~(Date.now() / 1000);
    const expire = now + config.expire_offset;
    await app.redis.expire(key, config.expire_offset);
    return expire;
  }

  generateToken({ aid, uid, atype, expire }) {
    const secret = 'wxapp';
    const hash = crypto.createHmac('sha256', secret)
      .update(`${aid}`)
      .update(`${uid}`)
      .update(`${atype}`)
      .update(`${expire}`)
      .digest('hex');
    return hash;
  }

  async getOpenid() {
    const { ctx, config } = this;
    if (!ctx.auth || !ctx.auth.aid) {
      ctx.throw(500, 'auth not found');
    }
    const { wxuser_id } = await ctx.API(`${config.msapi.user}/authwx/${ctx.auth.aid}`);
    const wxuser = await ctx.API(`${config.msapi.wx}/wxusers/${wxuser_id}`);
    return wxuser;
  }

}

module.exports = Home;
