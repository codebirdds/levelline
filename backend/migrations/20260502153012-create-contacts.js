'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('contacts', {
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

      email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isEmail: true
        }
      },

      phone: {
        type: Sequelize.STRING,
        allowNull: true
      },

      service_needed: {
        type: Sequelize.ENUM(
          'Web Development',
          'Mobile App Development',
          'UI/UX Design',
          'E-Commerce Solution',
          'Backend & APIs',
          'Maintenance & Support',
          'Other'
        ),
        allowNull: true
      },

      budget_range: {
        type: Sequelize.ENUM(
          'Under ₹25,000',
          '₹25,000 – ₹75,000',
          '₹75,000 – ₹2,00,000',
          '₹2,00,000 – ₹5,00,000',
          '₹5,00,000+'
        ),
        allowNull: true
      },

      project_description: {
        type: Sequelize.TEXT,
        allowNull: false
      },

      status: {
        type: Sequelize.ENUM('new', 'read', 'responded', 'archived'),
        defaultValue: 'new'
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
    await queryInterface.dropTable('contacts');

    // Clean up ENUM types
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_contacts_service_needed";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_contacts_budget_range";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_contacts_status";');
  }
};
