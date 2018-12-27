'use strict';

const BAR = Symbol('Context#bar');

module.exports = {
  foo(param) {
    // this 就是 ctx 对象，在其中可以调用 ctx 上的其他方法，或访问属性
    return param;
  },
  get bar() {
    // this 就是 ctx 对象，在其中可以调用 ctx 上的其他方法，或访问属性
    if (!this[BAR]) {
      // 例如，从 header 中获取，实际情况肯定更复杂
      this[BAR] = this.get('x-bar');
    }
    return this[BAR];
  },
  async API(url, options) {
    const res = await this.curl(url, Object.assign({ dataType: 'json', contentType: 'json' }, options));
    if (res.status > 300 || res.data.errcode > 0) {
      this.throw(res.status || 401, `[curl err!][${url}]: ${res.data.errmsg}`);
    }
    return res.data.data;
  },
};
