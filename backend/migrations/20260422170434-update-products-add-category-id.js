'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    // 🔥 1. Add new column category_id
    await queryInterface.addColumn('products', 'category_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'categories',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    // 🔥 2. OPTIONAL: remove old "category" column
    await queryInterface.removeColumn('products', 'category');
  },

  async down(queryInterface, Sequelize) {

    // 🔙 rollback

    // add back old column
    await queryInterface.addColumn('products', 'category', {
      type: Sequelize.STRING
    });

    // remove category_id
    await queryInterface.removeColumn('products', 'category_id');
  }
};