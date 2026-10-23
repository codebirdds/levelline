
'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('products', 'images', {
            type: Sequelize.JSON,
            allowNull: false,
            defaultValue: []
        });
    },

    async down(queryInterface) {
        await queryInterface.removeColumn('products', 'images');
    }
};
