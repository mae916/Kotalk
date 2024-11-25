'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Account', {
      user_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_email: {
        allowNull: false,
        type: Sequelize.STRING(100),
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING(255),
      },
      user_name: {
        allowNull: false,
        type: Sequelize.STRING(100),
      },
      social_type: {
        type: Sequelize.STRING(100),
      },
      social_id: {
        type: Sequelize.STRING(200),
      },
      join_date: {
        type: Sequelize.DATE,
      },
      last_login_date: {
        type: Sequelize.DATE,
      },
      deleted_date: {
        type: Sequelize.DATE,
      },
      refresh_token: {
        type: Sequelize.STRING(1000),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Account');
  },
};
