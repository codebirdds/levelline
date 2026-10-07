'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Contact extends Model {
    static associate(models) {
      // associations later
    }
  }

  Contact.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true
        }
      },

      phone: {
        type: DataTypes.STRING,
        allowNull: true
      },

      service_needed: {
        type: DataTypes.ENUM(
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
        type: DataTypes.ENUM(
          'Under ₹25,000',
          '₹25,000 – ₹75,000',
          '₹75,000 – ₹2,00,000',
          '₹2,00,000 – ₹5,00,000',
          '₹5,00,000+'
        ),
        allowNull: true
      },

      project_description: {
        type: DataTypes.TEXT,
        allowNull: false
      },

      status: {
        type: DataTypes.ENUM('new', 'read', 'responded', 'archived'),
        defaultValue: 'new'
      }
    },
    {
      sequelize,
      modelName: 'Contact',
      tableName: 'contacts',
      timestamps: true
    }
  );

  return Contact;
};