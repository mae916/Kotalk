'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chat_participant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Chat_participant.init(
    {
      room_id: DataTypes.INTEGER,
      user_id: DataTypes.INTEGER,
      friend_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Chat_participant',
      tableName: 'chat_participant',
      freezeTableName: true,
    }
  );
  return Chat_participant;
};
