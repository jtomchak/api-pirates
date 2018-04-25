"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn("Users", "email", Sequelize.STRING, {
        allowNull: false
      }),
      queryInterface.addColumn("Users", "role", Sequelize.STRING, {
        allowNull: false
      }),
      queryInterface.addColumn("Users", "github_auth_id", Sequelize.INTEGER, {
        allowNull: false
      })
    ];
  },

  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.removeColumn("Users", "email"),
      queryInterface.removeColumn("Users", "role"),
      queryInterface.removeColumn("Users", "github_auth_id")
    ];
  }
};
