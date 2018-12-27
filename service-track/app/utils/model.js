'use strict';

module.exports = Sequelize => {
  const { STRING, INTEGER, DATE, FLOAT, TEXT } = Sequelize;
  return {

    promo: {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      user_id: INTEGER,
      promo_type: {
        type: INTEGER,
        defaultValue: 1,
      },
      appid: STRING(32),
      promocode: STRING(64),
      wxbcode: STRING(255),
      page: STRING(255),

      status: {
        type: INTEGER,
        defaultValue: 0,
      },
      created_at: DATE,
      updated_at: DATE,
    },

    track: {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      track_type: INTEGER,
      scene: STRING(32),
      detail: STRING(128),
      user_id: INTEGER,
      promocode: STRING(32),

      status: {
        type: INTEGER,
        defaultValue: 0,
      },
      created_at: DATE,
      updated_at: DATE,
    },

    share: {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      share_type: INTEGER,
      page: STRING(255),
      user_id: INTEGER,
      promocode: STRING(32),

      status: {
        type: INTEGER,
        defaultValue: 0,
      },
      created_at: DATE,
      updated_at: DATE,
    },


  };
};
