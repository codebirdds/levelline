'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // Make the existing price column optional.
        await queryInterface.changeColumn('products', 'price', {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: true
        });

        // Add the is_outfit column.
        await queryInterface.addColumn('products', 'is_outfit', {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        });
    },

    async down(queryInterface, Sequelize) {
        // Remove is_outfit when rolling back.
        await queryInterface.removeColumn('products', 'is_outfit');

        // Restore the original price constraint.
        // This requires every existing price to be non-null.
        await queryInterface.changeColumn('products', 'price', {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false
        });
    }
};
