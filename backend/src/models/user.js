'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // associations later
    }
  }

  User.init(
    {
      first_name: {
        type: DataTypes.STRING,
        allowNull: false
      },

      last_name: {
        type: DataTypes.STRING,
        allowNull: false
      },

      mobile: {
        type: DataTypes.STRING,
        unique: true
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },

      password: {
        type: DataTypes.STRING,
        allowNull: false
      },

      role: {
        type: DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user'
      }
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      timestamps: true,

  
    }
  );

  return User;
};