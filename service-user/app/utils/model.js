'use strict';

module.exports = Sequelize => {
  const { STRING, INTEGER, DATE } = Sequelize;
  return {
    user: {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      uuid: STRING(64),
      name: STRING(64),
      avatar: STRING(255),
      gender: INTEGER,
      nickname: STRING(64),
      city: STRING(32),
      province: STRING(32),
      country: STRING(32),
      status: {
        type: INTEGER,
        defaultValue: 0,
      },
      created_at: DATE,
      updated_at: DATE,
    },
    authwx: {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: INTEGER,
      wxuser_id: INTEGER,
      expire_time: DATE,
      verify_time: DATE,
      status: {
        type: INTEGER,
        defaultValue: 0,
      },
      created_at: DATE,
      updated_at: DATE,
    },
  };
};
