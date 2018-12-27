'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.post('/login', controller.home.login);
  router.get('/users/:id', controller.user.user);
  router.put('/users/:id', controller.user.update);
  router.get('/authwx/:id', controller.authwx.authwx);
};
