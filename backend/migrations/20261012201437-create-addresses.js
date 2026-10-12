
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('addresses', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },

      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },

      full_name: {
        type: Sequelize.STRING,
        allowNull: false
      },

      phone: {
        type: Sequelize.STRING(15),
        allowNull: false
      },

      address_line1: {
        type: Sequelize.STRING,
        allowNull: false
      },

      building_name: {
        type: Sequelize.STRING,
        allowNull: true
      },

      floor: {
        type: Sequelize.STRING(50),
        allowNull: true
      },

      address_line2: {
        type: Sequelize.STRING,
        allowNull: true
      },

      landmark: {
        type: Sequelize.STRING,
        allowNull: true
      },

      delivery_instructions: {
        type: Sequelize.TEXT,
        allowNull: true
      },

      city: {
        type: Sequelize.STRING,
        allowNull: false
      },

      state: {
        type: Sequelize.STRING,
        allowNull: false
      },

      postal_code: {
        type: Sequelize.STRING(10),
        allowNull: false
      },

      country: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'India'
      },

      address_type: {
        type: Sequelize.ENUM('home', 'work', 'other'),
        allowNull: false,
        defaultValue: 'home'
      },

      is_default: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.addIndex('addresses', ['user_id']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('addresses');
  }
};
