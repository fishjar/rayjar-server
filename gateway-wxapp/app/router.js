'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get(`/test`, controller.home.test);
  router.post(`/login`, controller.home.login);
  router.post(`/wxuser`, controller.home.wxuser);
  router.get(`/users/:id`, controller.user.user);
  router.post(`/promo`, controller.home.promo);
  router.post(`/tracks`, controller.home.tracks);
  router.post(`/shares`, controller.home.shares);
  router.get(`/rjmsgs`, controller.home.rjmsgList);
  router.get(`/rjmsgs2`, controller.home.rjmsgList2);
  router.post(`/rjmsgs`, controller.home.rjmsgCreate);
};
