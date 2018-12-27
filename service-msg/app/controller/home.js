'use strict';

const Controller = require('egg').Controller;

const emailRule = {
  to: 'string',
  subject: 'string',
};

class HomeController extends Controller {
  async index() {
    this.ctx.body = 'hi, egg';
  }

  // from: '"Fred Foo 👻" <foo@example.com>', // sender address
  // to: 'bar@example.com, baz@example.com', // list of receivers
  // subject: 'Hello ✔', // Subject line
  // text: 'Hello world?', // plain text body
  // html: '<b>Hello world?</b>' // html body
  async email() {
    this.ctx.validate(emailRule);
    const { to, subject, text, html } = this.ctx.request.body;
    const { email: emailConfig } = this.config;
    const from = `Wxapp Notice <${emailConfig.auth.user}>`;
    let data;
    try {
      data = await this.ctx.email(emailConfig, { from, to, subject, text, html });
    } catch (error) {
      this.ctx.throw(500, error);
    }
    this.ctx.body = {
      errcode: 0,
      errmsg: 'send email success!',
      data,
    };

  }

}

module.exports = HomeController;
