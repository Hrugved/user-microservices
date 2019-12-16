'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING
      },
      emailVerified: {
        type: Sequelize.INTEGER
      },
      dateOfBirth: {
        type: Sequelize.DATEONLY
      },
      status: {
        type: Sequelize.INTEGER
      },
      password: {
        type: Sequelize.STRING
      },
      roles: {
        type: Sequelize.STRING,
      },
      lastRole: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};