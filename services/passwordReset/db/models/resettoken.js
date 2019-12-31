'use strict';
module.exports = (sequelize, DataTypes) => {
  const resetToken = sequelize.define('resetToken', {
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    otp: DataTypes.BIGINT
  }, {});
  resetToken.associate = function(models) {
    // associations can be defined here
  };
  return resetToken;
};
