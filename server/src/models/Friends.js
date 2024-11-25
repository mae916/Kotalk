'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Friends extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Friends.init(
    {
      user_id: DataTypes.INTEGER,
      friend_id: DataTypes.INTEGER,
      friend_name: DataTypes.STRING(100),
      hidden_yn: DataTypes.STRING(1),
      block_yn: DataTypes.STRING(1),
    },
    {
      sequelize,
      modelName: 'Friends',
      tableName: 'friends',
      freezeTableName: true,
    }
  );
  return Friends;
};
