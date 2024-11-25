'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chatting_room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Chatting_room.init(
    {
      room_id: {
        type: DataTypes.INTEGER,
        primaryKey: true, // 기본 키로 설정
        autoIncrement: true, // 자동 증가 옵션이 필요하다면 추가
      },
      last_message: DataTypes.STRING(200),
      last_message_created_at: DataTypes.DATE,
    },

    {
      sequelize,
      modelName: 'Chatting_room',
      tableName: 'chatting_room',
      freezeTableName: true,
    }
  );
  return Chatting_room;
};
