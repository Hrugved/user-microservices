'use strict';
module.exports = (sequelize, DataTypes) => {
  const resetToken = sequelize.define('resetToken', {
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    token: DataTypes.STRING
  }, {});
  resetToken.associate = function(models) {
    // associations can be defined here
  };
  return resetToken;
};
