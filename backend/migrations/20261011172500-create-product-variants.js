
'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('product_variants', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },

            product_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'products',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },

            color: {
                type: Sequelize.STRING,
                allowNull: false
            },

            color_code: {
                type: Sequelize.STRING,
                allowNull: true
            },

            sizes: {
                type: Sequelize.JSON,
                allowNull: false,
                defaultValue: []
            },

            images: {
                type: Sequelize.JSON,
                allowNull: false,
                defaultValue: []
            },

            status: {
                type: Sequelize.ENUM('active', 'inactive'),
                allowNull: false,
                defaultValue: 'active'
            },

            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
            },

            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
            }
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('product_variants');
    }
};