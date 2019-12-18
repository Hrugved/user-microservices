'use strict';
const bcrypt = require('bcrypt')

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: DataTypes.STRING,
    emailVerified: DataTypes.INTEGER,
    password: DataTypes.STRING,
    dateOfBirth: DataTypes.DATEONLY,
    status: DataTypes.INTEGER,
    roles: {
      type: DataTypes.STRING,
      get: function() {
        return JSON.parse(this.getDataValue('roles'))
      },
      set: function (rolesObj) {
        this.setDataValue('roles', JSON.stringify(rolesObj))
      }
    },
    lastRole: DataTypes.INTEGER
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};



