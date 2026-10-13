const axios = require('axios');
const crypto = require('crypto');
const { Op } = require('sequelize');
const db = require('../models');

const { Order, Payment, User, Cart, ProductVariant } = db;

const cashfreeBaseUrl =
  process.env.CASHFREE_ENV === 'production'
    ? 'https://api.cashfree.com/pg'
    : 'https://sandbox.cashfree.com/pg';

const cashfree = axios.create({
  baseURL: cashfreeBaseUrl,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'x-client-id': process.env.CASHFREE_APP_ID,
    'x-client-secret': process.env.CASHFREE_SECRET_KEY,
    'x-api-version': process.env.CASHFREE_API_VERSION || '2023-08-01'
  }
});

const createGatewayOrderId = () =>
  `CF_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

const createError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

class PaymentService {
  // INITIATE CASHFREE PAYMENT
  async initiate(orderId, userId) {
    const order = await Order.findOne({
      where: { id: orderId, user_id: userId }
    });

    if (!order) {
      throw createError('Order not found', 404);
    }

    // COD orders must be paid to the delivery person.
    if (order.payment_method === 'cod') {
      throw createError(
        'Cashfree payment is not available for COD orders'
      );
    }

    if (['cancelled', 'returned'].includes(order.order_status)) {
      throw createError('Payment is not allowed for this order');
    }

    if (order.payment_status === 'paid') {
      throw createError('This order has already been paid');
    }

    if (!process.env.CASHFREE_APP_ID || !process.env.CASHFREE_SECRET_KEY) {
      throw createError('Cashfree credentials are not configured', 500);
    }

    const amount = Number(order.total_amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      throw createError('Invalid order amount');
    }

    const user = await User.findByPk(userId);

    if (!user) {
      throw createError('User not found', 404);
    }

    const customerPhone =
      user.phone || user.mobile || user.mobile_number;

    if (!customerPhone || !user.email) {
      throw createError(
        'Customer phone and email are required for Cashfree payment'
      );
    }

    const gatewayOrderId = createGatewayOrderId();

    /*
     * Reuse the initial pending Cashfree payment record created
     * by order_service.js. If the previous attempt has already
     * failed or has a gateway order ID, create a new attempt.
     */
    let payment = await Payment.findOne({
      where: {
        order_id: order.id,
        user_id: userId,
        gateway: 'cashfree',
        gateway_order_id: null,
        payment_status: 'pending'
      },
      order: [['createdAt', 'ASC']]
    });

    if (payment) {
      await payment.update({
        gateway_order_id: gatewayOrderId,
        amount: order.total_amount,
        currency: order.currency || 'INR',
        payment_status: 'pending',
        payment_method: null,
        transaction_id: null,
        failure_reason: null,
        gateway_response: null
      });
    } else {
      payment = await Payment.create({
        order_id: order.id,
        user_id: userId,
        gateway: 'cashfree',
        gateway_order_id: gatewayOrderId,
        transaction_id: null,
        amount: order.total_amount,
        currency: order.currency || 'INR',
        payment_method: null,
        payment_status: 'pending'
      });
    }

    // A retry starts a new pending payment attempt.
    if (order.payment_status !== 'paid') {
      await order.update({ payment_status: 'pending' });
    }

    try {
      const response = await cashfree.post('/orders', {
        order_id: gatewayOrderId,
        order_amount: amount,
        order_currency: order.currency || 'INR',
        customer_details: {
          customer_id: String(user.id),
          customer_email: user.email,
          customer_phone: String(customerPhone)
        },
        order_note: `Payment for ${order.order_number}`
      });

      const cashfreeOrderId = response.data.order_id;

      await payment.update({
        gateway_order_id: cashfreeOrderId,
        gateway_response: {
          cf_order_id: response.data.cf_order_id,
          order_status: response.data.order_status
        }
      });

      return {
        payment_id: payment.id,
        order_id: order.id,
        order_number: order.order_number,
        gateway_order_id: cashfreeOrderId,
        cf_order_id: response.data.cf_order_id,
        payment_session_id: response.data.payment_session_id,
        amount: order.total_amount,
        currency: order.currency || 'INR',
        payment_status: payment.payment_status
      };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        'Unable to initiate Cashfree payment';

      await payment.update({
        payment_status: 'failed',
        failure_reason: message,
        gateway_response: error.response?.data || null
      });

      // Do not downgrade an order that has already been paid.
      const latestOrder = await Order.findByPk(order.id);

      if (latestOrder && latestOrder.payment_status !== 'paid') {
        await latestOrder.update({ payment_status: 'failed' });
      }

      throw createError(
        error.response?.data?.message ||
          'Unable to initiate payment. Please try again.'
      );
    }
  }

  // VERIFY PAYMENT WITH CASHFREE
  async verify(orderId, gatewayOrderId, userId) {
    const order = await Order.findOne({
      where: { id: orderId, user_id: userId }
    });

    if (!order) {
      throw createError('Order not found', 404);
    }

    if (order.payment_method === 'cod') {
      throw createError(
        'COD payment must be collected on delivery'
      );
    }

    const payment = await Payment.findOne({
      where: {
        order_id: order.id,
        user_id: userId,
        gateway: 'cashfree',
        gateway_order_id: gatewayOrderId
      }
    });

    if (!payment) {
      throw createError('Payment attempt not found', 404);
    }

    // Do not contact Cashfree for an already finalized attempt.
    if (
      order.payment_status === 'paid' &&
      payment.payment_status === 'success'
    ) {
      return {
        payment_id: payment.id,
        order_id: order.id,
        gateway_order_id: gatewayOrderId,
        transaction_id: payment.transaction_id,
        payment_status: 'success',
        order_payment_status: 'paid',
        order_status: order.order_status
      };
    }

    // Fetch the actual Cashfree order status.
    const orderResponse = await cashfree.get(
      `/orders/${encodeURIComponent(gatewayOrderId)}`
    );

    const gatewayOrder = orderResponse.data;

    if (
      gatewayOrder.order_currency !== payment.currency ||
      Math.round(Number(gatewayOrder.order_amount) * 100) !==
        Math.round(Number(payment.amount) * 100)
    ) {
      throw createError('Payment amount or currency mismatch');
    }

    // Fetch individual payment attempts.
    const paymentsResponse = await cashfree.get(
      `/orders/${encodeURIComponent(gatewayOrderId)}/payments`
    );

    const gatewayPayments = Array.isArray(paymentsResponse.data)
      ? paymentsResponse.data
      : [];

    const successfulPayment = gatewayPayments.find(
      (item) => item.payment_status === 'SUCCESS'
    );

    if (gatewayOrder.order_status === 'PAID' && successfulPayment) {
      if (
        successfulPayment.payment_amount !== undefined &&
        Math.round(Number(successfulPayment.payment_amount) * 100) !==
          Math.round(Number(payment.amount) * 100)
      ) {
        throw createError('Successful payment amount mismatch');
      }

      await this.finalizeSuccessfulPayment({
        order,
        payment,
        gatewayOrder,
        successfulPayment
      });

      const updatedOrder = await Order.findByPk(order.id);

      return {
        payment_id: payment.id,
        order_id: order.id,
        gateway_order_id: gatewayOrderId,
        transaction_id: successfulPayment.cf_payment_id
          ? String(successfulPayment.cf_payment_id)
          : null,
        payment_status: 'success',
        order_payment_status: updatedOrder.payment_status,
        order_status: updatedOrder.order_status
      };
    }

    // Handle unsuccessful attempts without downgrading paid orders.
    const latestAttempt = gatewayPayments[gatewayPayments.length - 1];
    const gatewayStatus = latestAttempt?.payment_status;

    if (
      gatewayStatus === 'FAILED' ||
      gatewayStatus === 'USER_DROPPED'
    ) {
      await payment.update({
        payment_status: 'failed',
        transaction_id: latestAttempt?.cf_payment_id
          ? String(latestAttempt.cf_payment_id)
          : null,
        payment_method: latestAttempt?.payment_group || null,
        failure_reason:
          latestAttempt?.payment_message ||
          `Cashfree payment status: ${gatewayStatus}`,
        gateway_response: {
          order_status: gatewayOrder.order_status,
          payment_status: gatewayStatus
        }
      });

      const latestOrder = await Order.findByPk(order.id);

      if (latestOrder.payment_status !== 'paid') {
        await latestOrder.update({ payment_status: 'failed' });
      }

      return {
        payment_id: payment.id,
        order_id: order.id,
        gateway_order_id: gatewayOrderId,
        payment_status: 'failed',
        order_payment_status:
          (await Order.findByPk(order.id)).payment_status
      };
    }

    await payment.update({
      payment_status: 'processing',
      gateway_response: {
        order_status: gatewayOrder.order_status,
        payment_status: gatewayStatus || 'PENDING'
      }
    });

    return {
      payment_id: payment.id,
      order_id: order.id,
      gateway_order_id: gatewayOrderId,
      payment_status: 'processing',
      order_payment_status: order.payment_status
    };
  }

  // FINALIZE A VERIFIED SUCCESSFUL CASHFREE PAYMENT
  async finalizeSuccessfulPayment({
    order,
    payment,
    gatewayOrder,
    successfulPayment
  }) {
    const transaction = await db.sequelize.transaction();

    try {
      const lockedOrder = await Order.findByPk(order.id, {
        transaction,
        lock: transaction.LOCK.UPDATE
      });

      const lockedPayment = await Payment.findByPk(payment.id, {
        transaction,
        lock: transaction.LOCK.UPDATE
      });

      if (!lockedOrder || !lockedPayment) {
        throw createError('Order or payment attempt not found', 404);
      }

      if (lockedOrder.payment_method === 'cod') {
        throw createError(
          'Cashfree cannot finalize a COD order'
        );
      }

      // Idempotency: do not deduct stock or clear the cart twice.
      if (lockedOrder.payment_status === 'paid') {
        await lockedPayment.update(
          {
            payment_status: 'success',
            transaction_id: successfulPayment.cf_payment_id
              ? String(successfulPayment.cf_payment_id)
              : null,
            payment_method: successfulPayment.payment_group || null,
            paid_at: successfulPayment.payment_time
              ? new Date(successfulPayment.payment_time)
              : new Date()
          },
          { transaction }
        );

        await transaction.commit();
        return;
      }

      if (['cancelled', 'returned'].includes(lockedOrder.order_status)) {
        throw createError(
          'Payment succeeded for a cancelled or returned order. Manual refund/reconciliation is required.'
        );
      }

      // Deduct stock using the saved order item snapshots.
      for (const item of lockedOrder.items) {
        const variant = await ProductVariant.findByPk(
          item.product_variant_id,
          {
            transaction,
            lock: transaction.LOCK.UPDATE
          }
        );

        if (!variant || !Array.isArray(variant.sizes)) {
          throw createError(
            `Stock reconciliation required for variant ${item.product_variant_id}`
          );
        }

        const sizes = variant.sizes.map((sizeItem) => ({ ...sizeItem }));

        const sizeIndex = sizes.findIndex(
          (sizeItem) =>
            String(sizeItem.size).toLowerCase() ===
            String(item.size).toLowerCase()
        );

        if (
          sizeIndex < 0 ||
          Number(sizes[sizeIndex].stock) < Number(item.quantity)
        ) {
          throw createError(
            `Insufficient stock for ${item.product_name}. Manual refund/reconciliation may be required.`
          );
        }

        sizes[sizeIndex].stock =
          Number(sizes[sizeIndex].stock) - Number(item.quantity);

        await variant.update({ sizes }, { transaction });
      }

      await lockedPayment.update(
        {
          payment_status: 'success',
          transaction_id: successfulPayment.cf_payment_id
            ? String(successfulPayment.cf_payment_id)
            : null,
          payment_method: successfulPayment.payment_group || null,
          paid_at: successfulPayment.payment_time
            ? new Date(successfulPayment.payment_time)
            : new Date(),
          gateway_response: {
            order_status: gatewayOrder.order_status,
            payment_status: successfulPayment.payment_status
          }
        },
        { transaction }
      );

      await lockedOrder.update(
        {
          payment_status: 'paid',
          order_status: 'confirmed'
        },
        { transaction }
      );

      // Remove only cart rows captured in this order.
      const cartIds = (lockedOrder.items || [])
        .map((item) => Number(item.cart_id))
        .filter(Number.isInteger);

      if (cartIds.length) {
        await Cart.destroy({
          where: {
            id: { [Op.in]: cartIds },
            user_id: lockedOrder.user_id
          },
          transaction
        });
      }

      await transaction.commit();
    } catch (error) {
      if (!transaction.finished) {
        await transaction.rollback();
      }

      throw error;
    }
  }

  // LIST PAYMENT ATTEMPTS FOR A CUSTOMER'S ORDER
  async findByOrder(orderId, userId) {
    const order = await Order.findOne({
      where: { id: orderId, user_id: userId },
      attributes: ['id']
    });

    if (!order) {
      throw createError('Order not found', 404);
    }

    return Payment.findAll({
      where: {
        order_id: order.id,
        user_id: userId
      },
      attributes: [
        'id',
        'order_id',
        'gateway',
        'gateway_order_id',
        'transaction_id',
        'amount',
        'currency',
        'payment_method',
        'payment_status',
        'failure_reason',
        'paid_at',
        'createdAt'
      ],
      order: [['createdAt', 'DESC']]
    });
  }


    async findAllPayments(userId) {

    return Payment.findAll({
      where: {
        user_id: userId,
      },
      attributes: [
        'id',
        'order_id',
        'gateway',
        'gateway_order_id',
        'transaction_id',
        'amount',
        'currency',
        'payment_method',
        'payment_status',
        'failure_reason',
        'paid_at',
        'createdAt'
      ],
      order: [['createdAt', 'DESC']]
    });
  }
}

module.exports = new PaymentService();
