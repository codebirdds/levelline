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

      name: {
        type: Sequelize.STRING,
        allowNull: false
      },

      description: {
        type: Sequelize.TEXT
      },

      price: {
        type: Sequelize.FLOAT,
        allowNull: false
      },

      discount_price: {
        type: Sequelize.FLOAT
      },

      stock: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },

      sold_quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },

      sku: {
        type: Sequelize.STRING,
        unique: true
      },

      images: {
        type: Sequelize.JSON
      },

      category: {
        type: Sequelize.STRING
      },

      unit: {
        type: Sequelize.ENUM('piece', 'kg', 'gram', 'liter', 'ml'),
        allowNull: false,
        defaultValue: 'piece'
      },

      weight_or_volume: {
        type: Sequelize.FLOAT
      },

      status: {
        type: Sequelize.ENUM('active', 'inactive', 'draft'),
        allowNull: false,
        defaultValue: 'active'
      },

      created_by: {
        type: Sequelize.INTEGER,
        allowNull: true
      },

      updated_by: {
        type: Sequelize.INTEGER,
        allowNull: true
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

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('products');

    // 🔥 important for PostgreSQL (Supabase)
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_products_unit";'
    );

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_products_status";'
    );
  }
};