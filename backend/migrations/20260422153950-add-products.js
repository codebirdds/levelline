
'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('products', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },

            // Basic product information
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },

            slug: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: true
            },

            description: {
                type: Sequelize.TEXT,
                allowNull: true
            },

            brand: {
                type: Sequelize.STRING,
                allowNull: true
            },

            product_type: {
                type: Sequelize.STRING,
                allowNull: true
            },

            gender: {
                type: Sequelize.ENUM(
                    'men',
                    'women',
                    'unisex',
                    'boys',
                    'girls',
                    'kids'
                ),
                allowNull: true
            },

            // Category information
            category_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'categories',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT'
            },

            subcategory: {
                type: Sequelize.STRING,
                allowNull: true
            },

            // Product specifications
            material: {
                type: Sequelize.STRING,
                allowNull: true
            },

            pattern: {
                type: Sequelize.STRING,
                allowNull: true
            },

            fit: {
                type: Sequelize.STRING,
                allowNull: true
            },

            occasion: {
                type: Sequelize.STRING,
                allowNull: true
            },

            country_of_origin: {
                type: Sequelize.STRING,
                allowNull: true
            },

            care_instructions: {
                type: Sequelize.TEXT,
                allowNull: true
            },

            details: {
                type: Sequelize.JSON,
                allowNull: true
            },

            // Common pricing
            price: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false
            },

            discount_price: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: true
            },

            // Product status
            status: {
                type: Sequelize.ENUM(
                    'active',
                    'inactive',
                    'draft'
                ),
                allowNull: false,
                defaultValue: 'draft'
            },

            is_featured: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },

            // Audit fields
            created_by: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },

            updated_by: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },

            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            },

            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            }
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('products');
    }
};