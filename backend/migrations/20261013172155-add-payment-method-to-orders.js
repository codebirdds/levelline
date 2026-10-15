
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },

      order_number: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },

      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },

      address_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'addresses',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },

      items: {
        type: Sequelize.JSON,
        allowNull: false
      },

      subtotal: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      },

      discount_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      },

      shipping_fee: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      },

      tax_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      },

      total_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      },

      currency: {
        type: Sequelize.STRING(3),
        allowNull: false,
        defaultValue: 'INR'
      },

      order_status: {
        type: Sequelize.ENUM(
          'pending',
          'confirmed',
          'processing',
          'shipped',
          'delivered',
          'cancelled',
          'returned'
        ),
        allowNull: false,
        defaultValue: 'pending'
      },

      payment_status: {
        type: Sequelize.ENUM(
          'pending',
          'paid',
          'failed',
          'partially_refunded',
          'refunded'
        ),
        allowNull: false,
        defaultValue: 'pending'
      },

      payment_method: {
        type: Sequelize.ENUM('cashfree', 'cod'),
        allowNull: false,
        defaultValue: 'cod'
      },

      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },

      cancelled_at: {
        type: Sequelize.DATE,
        allowNull: true
      },

      delivered_at: {
        type: Sequelize.DATE,
        allowNull: true
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal(
          'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
        )
      }
    });

    await queryInterface.addIndex('orders', ['user_id', 'createdAt'], {
      name: 'idx_orders_user_created'
    });

    await queryInterface.addIndex('orders', ['order_status'], {
      name: 'idx_orders_status'
    });

    await queryInterface.addIndex('orders', ['payment_status'], {
      name: 'idx_orders_payment_status'
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('orders');
  }
};
