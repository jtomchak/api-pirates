"use strict";
module.exports = (sequelize, DataTypes) => {
  var Pirate = sequelize.define(
    "Pirate",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      family_name: DataTypes.STRING,
      rank: DataTypes.INTEGER,
      beard: DataTypes.STRING,
      nick_name: DataTypes.STRING,
      birth_country: DataTypes.STRING,
      worth: DataTypes.INTEGER,
      date_of_death: DataTypes.INTEGER
    },
    {}
  );
  Pirate.associate = function(models) {
    // associations can be defined here
  };
  return Pirate;
};
