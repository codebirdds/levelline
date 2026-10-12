
'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    static associate(models) {
      Address.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
    }
  }

  Address.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      full_name: {
        type: DataTypes.STRING,
        allowNull: false
      },

      phone: {
        type: DataTypes.STRING(15),
        allowNull: false
      },

      address_line1: {
        type: DataTypes.STRING,
        allowNull: false
      },

      building_name: {
        type: DataTypes.STRING,
        allowNull: true
      },

      floor: {
        type: DataTypes.STRING(50),
        allowNull: true
      },

      address_line2: {
        type: DataTypes.STRING,
        allowNull: true
      },

      landmark: {
        type: DataTypes.STRING,
        allowNull: true
      },

      delivery_instructions: {
        type: DataTypes.TEXT,
        allowNull: true
      },

      city: {
        type: DataTypes.STRING,
        allowNull: false
      },

      state: {
        type: DataTypes.STRING,
        allowNull: false
      },

      postal_code: {
        type: DataTypes.STRING(10),
        allowNull: false
      },

      country: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'India'
      },

      address_type: {
        type: DataTypes.ENUM('home', 'work', 'other'),
        allowNull: false,
        defaultValue: 'home'
      },

      is_default: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    },
    {
      sequelize,
      modelName: 'Address',
      tableName: 'addresses',
      timestamps: true,
      indexes: [
        {
          fields: ['user_id']
        }
      ]
    }
  );

  return Address;
};