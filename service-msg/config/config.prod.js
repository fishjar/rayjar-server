'use strict';

module.exports = appInfo => {
  const config = exports = {};

  config.logger = {
    dir: '/data/log/wxapp/msg',
  };

  return config;
};
