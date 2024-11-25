'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class msg_read_user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  msg_read_user.init(
    {
      chat_id: DataTypes.INTEGER,
      user_id: DataTypes.INTEGER,
      room_id: DataTypes.INTEGER,
      read_yn: DataTypes.STRING(1),
    },
    {
      sequelize,
      modelName: 'Msg_read_user',
      tableName: 'msg_read_user',
      freezeTableName: true,
    }
  );
  return msg_read_user;
};
