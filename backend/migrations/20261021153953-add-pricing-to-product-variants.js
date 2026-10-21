'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn(
            'product_variants',
            'price',
            {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: true,
                defaultValue: null
            }
        );

        await queryInterface.addColumn(
            'product_variants',
            'discount_price',
            {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: true,
                defaultValue: null
            }
        );
    },

    async down(queryInterface) {
        await queryInterface.removeColumn(
            'product_variants',
            'discount_price'
        );

        await queryInterface.removeColumn(
            'product_variants',
            'price'
        );
    }
};
