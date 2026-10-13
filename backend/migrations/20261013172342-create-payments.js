
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('payments', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },

      order_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'orders',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
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

      gateway: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: 'cashfree'
      },

      gateway_order_id: {
        type: Sequelize.STRING(100),
        allowNull: true
      },

      transaction_id: {
        type: Sequelize.STRING(150),
        allowNull: true
      },

      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },

      currency: {
        type: Sequelize.STRING(3),
        allowNull: false,
        defaultValue: 'INR'
      },

      payment_method: {
        type: Sequelize.STRING(50),
        allowNull: true
      },

      payment_status: {
        type: Sequelize.ENUM(
          'pending',
          'processing',
          'success',
          'failed',
          'cancelled',
          'partially_refunded',
          'refunded'
        ),
        allowNull: false,
        defaultValue: 'pending'
      },

      failure_reason: {
        type: Sequelize.TEXT,
        allowNull: true
      },

      gateway_response: {
        type: Sequelize.JSON,
        allowNull: true
      },

      paid_at: {
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

    await queryInterface.addIndex('payments', ['order_id'], {
      name: 'idx_payments_order'
    });

    await queryInterface.addIndex('payments', ['user_id'], {
      name: 'idx_payments_user'
    });

    await queryInterface.addIndex('payments', ['gateway_order_id'], {
      name: 'idx_payments_gateway_order'
    });

    await queryInterface.addIndex(
      'payments',
      ['gateway', 'transaction_id'],
      {
        unique: true,
        name: 'unique_gateway_transaction'
      }
    );

    await queryInterface.addIndex('payments', ['payment_status'], {
      name: 'idx_payments_status'
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('payments');
  }
};