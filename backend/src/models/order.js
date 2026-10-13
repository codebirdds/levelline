
'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Order extends Model {
        static associate(models) {
            Order.belongsTo(models.User, {
                foreignKey: 'user_id',
                as: 'user'
            });

            Order.belongsTo(models.Address, {
                foreignKey: 'address_id',
                as: 'address'
            });

            // One order can have multiple payment attempts
            Order.hasMany(models.Payment, {
                foreignKey: 'order_id',
                as: 'payments'
            });
        }
    }

    Order.init(
        {
            order_number: {
                type: DataTypes.STRING(50),
                allowNull: false,
                unique: true
            },

            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },

            address_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },

            // Snapshot of all purchased cart items
            items: {
                type: DataTypes.JSON,
                allowNull: false
            },

            subtotal: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0
            },

            discount_amount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0
            },

            shipping_fee: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0
            },

            tax_amount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0
            },

            total_amount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0
            },

            currency: {
                type: DataTypes.STRING(3),
                allowNull: false,
                defaultValue: 'INR'
            },

            order_status: {
                type: DataTypes.ENUM(
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
                type: DataTypes.ENUM(
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
                type: DataTypes.ENUM('cashfree', 'cod'),
                allowNull: false,
                defaultValue: 'cashfree'
            },

            notes: {
                type: DataTypes.TEXT,
                allowNull: true
            },

            cancelled_at: {
                type: DataTypes.DATE,
                allowNull: true
            },

            delivered_at: {
                type: DataTypes.DATE,
                allowNull: true
            }
        },
        {
            sequelize,
            modelName: 'Order',
            tableName: 'orders',
            timestamps: true,
            indexes: [
                {
                    unique: true,
                    fields: ['order_number'],
                    name: 'unique_order_number'
                },
                {
                    fields: ['user_id', 'createdAt'],
                    name: 'idx_orders_user_created'
                },
                {
                    fields: ['order_status'],
                    name: 'idx_orders_status'
                },
                {
                    fields: ['payment_status'],
                    name: 'idx_orders_payment_status'
                }
            ]
        }
    );

    return Order;
};
