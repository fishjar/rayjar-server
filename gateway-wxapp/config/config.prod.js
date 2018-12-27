'use strict';

module.exports = appInfo => {
  const config = exports = {};

  config.logger = {
    dir: '/data/log/wxapp/gateway',
  };

  return config;
};
