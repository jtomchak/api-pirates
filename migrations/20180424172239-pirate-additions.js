"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn("Pirates", "rank", Sequelize.STRING, {
        allowNull: false
      })
    ];
  },

  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.removeColumn("Pirates", "rank"),
      queryInterface.removeColumn("Pirates", "nick_name"),
      queryInterface.removeColumn("Pirates", "beard")
    ];
  }
};
