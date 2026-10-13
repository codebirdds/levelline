
'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    static associate(models) {
      Cart.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });

      Cart.belongsTo(models.Product, {
        foreignKey: 'product_id',
        as: 'product'
      });

      Cart.belongsTo(models.ProductVariant, {
        foreignKey: 'product_variant_id',
        as: 'variant'
      });
    }
  }

  Cart.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      product_variant_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      size: {
        type: DataTypes.STRING,
        allowNull: false
      },

      quantity: { 
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
          min: 1,
          isInt: true
        }
      }
    },
    {
      sequelize,
      modelName: 'Cart',
      tableName: 'carts',
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: [
            'user_id',
            'product_variant_id',
            'size'
          ],
          name: 'unique_user_cart_variant_size'
        }
      ]
    }
  );

  return Cart;
};