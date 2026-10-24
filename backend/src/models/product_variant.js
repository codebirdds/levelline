
'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ProductVariant extends Model {
        static associate(models) {
            ProductVariant.belongsTo(models.Product, {
                foreignKey: 'product_id',
                as: 'product'
            });
        }
    }

    ProductVariant.init(
        {
            product_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },

            name: {
                type: DataTypes.STRING,
                allowNull: true
            },

            description: {
                type: DataTypes.TEXT,
                allowNull: true
            },

            color: {
                type: DataTypes.STRING,
                allowNull: false
            },

            color_code: {
                type: DataTypes.STRING,
                allowNull: true
            },

            // Variant-level pricing
            price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true
            },

            discount_price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true
            },

            // Array of sizes with individual SKU and stock
            sizes: {
                type: DataTypes.JSON,
                allowNull: false,
                defaultValue: []
            },

            // Images belonging to this color
            images: {
                type: DataTypes.JSON,
                allowNull: false,
                defaultValue: []
            },

            status: {
                type: DataTypes.ENUM('active', 'inactive'),
                allowNull: false,
                defaultValue: 'active'
            }
        },
        {
            sequelize,
            modelName: 'ProductVariant',
            tableName: 'product_variants',
            timestamps: true
        }
    );

    return ProductVariant;
};