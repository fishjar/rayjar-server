'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.post('/promo', controller.home.promo);
  router.resources('promos', '/promos', controller.promos);
  router.resources('tracks', '/tracks', controller.tracks);
  router.resources('shares', '/shares', controller.shares);
};
