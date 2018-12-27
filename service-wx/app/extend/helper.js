'use strict';

const { URL } = require('url');
const XML = require('pixl-xml');
const crypto = require('crypto');

const fs = require('fs-extra');
const path = require('path');

module.exports = {
  foo(param) {
    // this 是 helper 对象，在其中可以调用其他 helper 方法
    // this.ctx => context 对象
    // this.app => application 对象
    return param;
  },
  obj2arr(obj) {
    // {a:1,b:2} -> [ 'a', 1, 'b', 2 ]
    return Object.keys(obj).reduce((arr, key) => [...arr, key, obj[key]], []);
  },
  generateURL(url, params) {
    const myURL = new URL(url);
    if (params) {
      Object.keys(params).forEach(key => myURL.searchParams.append(key, params[key]));
    }
    return myURL;
  },
  generateHref(url, params) {
    return this.generateURL(url, params).href;
  },
  xml2json(xml) {
    return XML.parse(xml);
  },
  json2xml(json) {
    return XML.stringify(json, 'xml');
  },
  wxSign(obj, key) {
    const stringA = Object.keys(obj).sort().filter(k => k !== 'sign' && obj[k]).map(k => `${k}=${obj[k]}`).join('&');
    const stringSignTemp = stringA + "&key=" + key;
    const sign = crypto.createHash('md5').update(stringSignTemp).digest('hex').toUpperCase();
    return sign;
  },
  async createFile(target, buf) {
    if (await fs.exists(target)) {
      return;
    }
    await fs.ensureDir(path.dirname(target));
    return fs.writeFile(target, buf);
  },
};
