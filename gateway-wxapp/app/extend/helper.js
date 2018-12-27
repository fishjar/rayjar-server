'use strict';

const { URL } = require('url');
const Hashids = require('hashids');
const hashids = new Hashids('mslab');

module.exports = {
  foo(param) {
    // this 是 helper 对象，在其中可以调用其他 helper 方法
    // this.ctx => context 对象
    // this.app => application 对象
    return param;
  },
  obj2arr(obj) {
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
  hashids,
  formatTime(date) {
    if (typeof (date) === 'string') {
      date = new Date(date)
    }
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(this.formatNumber).join('-') + ' ' + [hour, minute, second].map(this.formatNumber).join(':')
  },
  formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  },

};
