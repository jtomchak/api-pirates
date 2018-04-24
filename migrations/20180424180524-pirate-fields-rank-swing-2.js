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
    return [queryInterface.removeColumn("Pirates", "rank")];
  }
};
