'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      // One category can have many products
      Category.hasMany(models.Product, {
        foreignKey: 'category_id',
        as: 'products'
      });
    }
  }

  Category.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },

      description: {
        type: DataTypes.TEXT
      },

      status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active'
      },

      created_by: {
        type: DataTypes.INTEGER
      },

      updated_by: {
        type: DataTypes.INTEGER
      }
    },
    {
      sequelize,
      modelName: 'Category',
      tableName: 'categories',
      timestamps: true
    }
  );

  return Category;
};