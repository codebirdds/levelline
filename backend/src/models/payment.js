
'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Payment extends Model {
        static associate(models) {
            Payment.belongsTo(models.Order, {
                foreignKey: 'order_id',
                as: 'order'
            });

            Payment.belongsTo(models.User, {
                foreignKey: 'user_id',
                as: 'user'
            });
        }
    }

    Payment.init(
        {
            order_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },

            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },

            gateway: {
                type: DataTypes.STRING(50),
                allowNull: false,
                defaultValue: 'cashfree'
            },

            // Reference for the payment order created with Cashfree
            gateway_order_id: {
                type: DataTypes.STRING(100),
                allowNull: true
            },

            // Gateway payment/transaction reference
            transaction_id: {
                type: DataTypes.STRING(150),
                allowNull: true
            },

            amount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false
            },

            currency: {
                type: DataTypes.STRING(3),
                allowNull: false,
                defaultValue: 'INR'
            },

            payment_method: {
                type: DataTypes.ENUM('cashfree', 'cod', 'razorpay'),
                allowNull: false,
                defaultValue: 'cashfree'
            },

            payment_status: {
                type: DataTypes.ENUM(
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
                type: DataTypes.TEXT,
                allowNull: true
            },

            gateway_response: {
                type: DataTypes.JSON,
                allowNull: true
            },

            paid_at: {
                type: DataTypes.DATE,
                allowNull: true
            }
        },
        {
            sequelize,
            modelName: 'Payment',
            tableName: 'payments',
            timestamps: true,
            indexes: [
                {
                    fields: ['order_id'],
                    name: 'idx_payments_order'
                },
                {
                    fields: ['user_id'],
                    name: 'idx_payments_user'
                },
                {
                    fields: ['gateway_order_id'],
                    name: 'idx_payments_gateway_order'
                },
                {
                    unique: true,
                    fields: ['gateway', 'transaction_id'],
                    name: 'unique_gateway_transaction'
                },
                {
                    fields: ['payment_status'],
                    name: 'idx_payments_status'
                }
            ]
        }
    );

    return Payment;
};
