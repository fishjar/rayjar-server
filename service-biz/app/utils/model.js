'use strict';

module.exports = Sequelize => {
  const { STRING, INTEGER, DATE, TEXT } = Sequelize;
  return {

    rjmsg: {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      pid: INTEGER,
      user_id: INTEGER,
      appid: STRING(32),
      name: STRING(32),
      email: STRING(32),
      phone: STRING(32),
      cont: TEXT,
      ext: TEXT,
      msg_status: {
        type: INTEGER,
        defaultValue: 1,
      },

      status: {
        type: INTEGER,
        defaultValue: 0,
      },
      created_at: DATE,
      updated_at: DATE,
    },

  };
};
