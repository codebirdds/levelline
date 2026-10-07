'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        static associate(models) {
            // optional: link to user
            Product.belongsTo(models.User, {
                foreignKey: 'created_by',
                as: 'creator'
            });

            Product.belongsTo(models.Category, {
                foreignKey: 'category_id',
                as: 'category'
            });
        }
    }

    Product.init(
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },

            description: {
                type: DataTypes.TEXT
            },

            price: {
                type: DataTypes.FLOAT,
                allowNull: false
            },

            discount_price: {
                type: DataTypes.FLOAT
            },

            stock: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            },

            sold_quantity: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            },

            sku: {
                type: DataTypes.STRING,
                unique: true
            },

            images: {
                type: DataTypes.JSON
            },

            category_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },

            unit: {
                type: DataTypes.ENUM('piece', 'kg', 'gram', 'liter', 'ml'),
                defaultValue: 'piece'
            },

            weight_or_volume: {
                type: DataTypes.FLOAT
            },

            status: {
                type: DataTypes.ENUM('active', 'inactive', 'draft'),
                defaultValue: 'active'
            },

            created_by: {
                type: DataTypes.INTEGER,
                allowNull: true
            },

            updated_by: {
                type: DataTypes.INTEGER,
                allowNull: true
            }
        },
        {
            sequelize,
            modelName: 'Product',
            tableName: 'products',
            timestamps: true // auto adds createdAt & updatedAt
        }
    );

    return Product;
};