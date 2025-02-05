'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Account.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true, // 기본 키로 설정
        autoIncrement: true, // 자동 증가 옵션이 필요하다면 추가
      },
      user_email: DataTypes.STRING(100),
      password: DataTypes.STRING(255),
      user_name: DataTypes.STRING(100),
      social_type: DataTypes.STRING(100),
      social_id: DataTypes.STRING(200),
      join_date: DataTypes.DATE,
      last_login_date: DataTypes.DATE,
      deleted_date: DataTypes.DATE,
      refresh_token: DataTypes.STRING(1000),
    },
    {
      sequelize,
      modelName: 'Account',
      tableName: 'account',
      freezeTableName: true,
    }
  );
  return Account;
};
