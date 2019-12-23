'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    password: DataTypes.STRING,
    dateOfBirth: DataTypes.DATEONLY,
    status: DataTypes.INTEGER,
    roles: {
      type: DataTypes.STRING,
      get: function() {
        // return this.getDataValue('roles').split(';')
        return JSON.parse(this.getDataValue('roles'))
      },
      set: function (val) {
        // this.setDataValue('roles', val.join(';'))
        return this.setDataValue('roles', JSON.stringify(val));
      }
    },
    lastRole: DataTypes.INTEGER
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};



