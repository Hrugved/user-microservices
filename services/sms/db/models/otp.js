'use strict';
module.exports = (sequelize, DataTypes) => {
  const otp = sequelize.define('otp', {
    phone: DataTypes.BIGINT,
    otp: DataTypes.BIGINT,
    otpCreatedAt: DataTypes.DATE
  }, {});
  otp.associate = function(models) {
    // associations can be defined here
  };
  return otp;
};