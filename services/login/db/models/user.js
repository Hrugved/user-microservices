'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    emailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    password: DataTypes.STRING,
    phone: DataTypes.BIGINT,
    status:{
      type: DataTypes.TINYINT,
      defaultValue: 0
    }
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};