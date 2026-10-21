
'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        static associate(models) {
            Product.belongsTo(models.User, {
                foreignKey: 'created_by',
                as: 'creator'
            });

            Product.belongsTo(models.User, {
                foreignKey: 'updated_by',
                as: 'updater'
            });

            Product.belongsTo(models.Category, {
                foreignKey: 'category_id',
                as: 'category'
            });

            Product.hasMany(models.ProductVariant, {
                foreignKey: 'product_id',
                as: 'variants',
                onDelete: 'CASCADE'
            });
        }
    }

    Product.init(
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },

            slug: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: true
            },

            description: {
                type: DataTypes.TEXT,
                allowNull: true
            },

            brand: {
                type: DataTypes.STRING,
                allowNull: true
            },

            product_type: {
                type: DataTypes.STRING,
                allowNull: true
            },

            gender: {
                type: DataTypes.ENUM(
                    'men', 'women', 'unisex',
                    'boys', 'girls', 'kids'
                ),
                allowNull: true
            },

            category_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },

            subcategory: {
                type: DataTypes.STRING,
                allowNull: true
            },

            material: {
                type: DataTypes.STRING,
                allowNull: true
            },

            pattern: {
                type: DataTypes.STRING,
                allowNull: true
            },

            fit: {
                type: DataTypes.STRING,
                allowNull: true
            },

            occasion: {
                type: DataTypes.STRING,
                allowNull: true
            },

            country_of_origin: {
                type: DataTypes.STRING,
                allowNull: true
            },

            care_instructions: {
                type: DataTypes.TEXT,
                allowNull: true
            },

            // Additional product specifications
            details: {
                type: DataTypes.JSON,
                allowNull: true
            },

            price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true
            },

            discount_price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true
            },

            status: {
                type: DataTypes.ENUM(
                    'active', 'inactive', 'draft'
                ),
                allowNull: false,
                defaultValue: 'draft'
            },

            is_featured: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },

            is_outfit: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
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
            timestamps: true
        }
    );

    return Product;
};