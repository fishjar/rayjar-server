'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/test', controller.home.test);
  router.get('/token/:appid', controller.home.token);
  router.post('/wxcode/:appid/:ctype', controller.home.wxcode);
  router.post('/login', controller.home.login);
  router.post('/wxuser', controller.home.wxuser);
  router.get('/wxusers/:id', controller.wxuser.wxuser);
  router.get('/wxusers', controller.wxuser.wxusers);
  router.get('/wxapps/:id', controller.wxapp.wxapp);
  router.get('/wxapps', controller.wxapp.wxapps);
  router.put('/wxapps/:id', controller.wxapp.update);
  router.post('/wxapps', controller.wxapp.create);
  router.get('/wxmchs', controller.wxmch.wxmchs);
  router.post('/wxmchs', controller.wxmch.create);
  router.post('/unifiedorder', controller.home.unifiedorder);
  router.post('/payaction', controller.home.payaction);
};
