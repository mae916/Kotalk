'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chatting extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Chatting.init(
    {
      chat_id: {
        type: DataTypes.INTEGER,
        primaryKey: true, // 기본 키로 설정
        autoIncrement: true, // 자동 증가 옵션이 필요하다면 추가
      },
      user_id: DataTypes.INTEGER,
      room_id: DataTypes.INTEGER,
      message: DataTypes.STRING,
      del_yn: DataTypes.STRING(1),
    },
    {
      sequelize,
      modelName: 'Chatting',
      tableName: 'chatting',
      freezeTableName: true,
    }
  );
  return Chatting;
};
