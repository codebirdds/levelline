
'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('product_variants', 'name', {
            type: Sequelize.STRING,
            allowNull: true
        });

        await queryInterface.addColumn('product_variants', 'description', {
            type: Sequelize.TEXT,
            allowNull: true
        });
    },

    async down(queryInterface) {
        await queryInterface.removeColumn('product_variants', 'description');
        await queryInterface.removeColumn('product_variants', 'name');
    }
};
