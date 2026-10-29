
'use strict';

const crypto = require('crypto');
const razorpay = require('../../config/razorpay');
const { Order, Payment, sequelize } = require('../models');

const createError = (message, statusCode = 400) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

// Create a Razorpay order for an existing internal order
exports.createRazorpayOrder = async (orderId, userId) => {
    const transaction = await sequelize.transaction();

    try {
        const order = await Order.findOne({
            where: {
                id: orderId,
                user_id: userId
            },
            transaction,
            lock: transaction.LOCK.UPDATE
        });

        if (!order) {
            throw createError('Order not found', 404);
        }

        if (['cancelled', 'delivered', 'returned'].includes(order.order_status)) {
            throw createError('Payment is not allowed for this order');
        }

        if (order.payment_status === 'paid') {
            throw createError('This order has already been paid');
        }

        const amount = Math.round(Number(order.total_amount) * 100);
        console.log("amount:::::::::::::::::::", amount)


        if (amount <= 0) {
            throw createError('Invalid order amount');
        }

        const currency = order.currency || 'INR';

        // This integration currently supports INR.
        if (currency !== 'INR') {
            throw createError('Only INR payments are supported');
        }


        // Create the order with Razorpay.
        // Do not create a new internal Order here.
        const razorpayOrder = await razorpay.orders.create({
            amount,
            currency,
            receipt: String(order.order_number).slice(0, 40),
            notes: {
                internal_order_id: String(order.id),
                order_number: String(order.order_number),
                user_id: String(userId)
            }
        });



        // Persist the payment attempt.
        // These fields must exist in your Payment model.
        await Payment.create({
            user_id: userId,
            order_id: order.id,
            amount: amount,
            currency,
            gateway: 'razorpay',
            payment_method: 'razorpay',
            payment_status: 'processing',
            gateway_order_id: razorpayOrder.id
        }, { transaction });

        await order.update({
            payment_method: 'razorpay'
        }, { transaction });

        await transaction.commit();

        return {
            key: process.env.RAZORPAY_KEY_ID,
            razorpay_order_id: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            internal_order_id: order.id,
            order_number: order.order_number
        };
    } catch (error) {
        if (!transaction.finished) {
            await transaction.rollback();
        }

        throw error;
    }
};

// Verify Razorpay checkout signature and confirm captured payment.
exports.verifyRazorpayPayment = async (data, userId) => {
    let transaction;

    try {
        console.log("[VERIFY] Started");
        const {
            internal_order_id,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = data;

        if (
            !internal_order_id ||
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {
            throw createError("All payment verification fields are required");
        }

        console.log("[VERIFY] Verifying signature");

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest();

        if (!/^[a-f0-9]{64}$/i.test(razorpay_signature)) {
            throw createError("Invalid payment signature");
        }

        const receivedSignature = Buffer.from(razorpay_signature, "hex");

        if (
            receivedSignature.length !== expectedSignature.length ||
            !crypto.timingSafeEqual(expectedSignature, receivedSignature)
        ) {
            throw createError("Payment signature verification failed");
        }

        console.log("[VERIFY] Signature valid. Fetching Razorpay payment");

        const razorpayPayment = await razorpay.payments.fetch(
            razorpay_payment_id
        );

        console.log("[VERIFY] Razorpay payment fetched", {
            status: razorpayPayment.status,
            order_id: razorpayPayment.order_id,
            currency: razorpayPayment.currency
        });

        transaction = await sequelize.transaction();

        console.log("[VERIFY] Transaction started");

        const order = await Order.findOne({
            where: {
                id: internal_order_id,
                user_id: userId
            },
            transaction,
            lock: transaction.LOCK.UPDATE
        });

        if (!order) {
            throw createError("Order not found", 404);
        }

        const payment = await Payment.findOne({
            where: {
                order_id: order.id,
                gateway_order_id: razorpay_order_id
            },
            transaction,
            lock: transaction.LOCK.UPDATE
        });

        if (!payment) {
            throw createError("Payment record not found", 404);
        }

        if (
            order.payment_status === "paid" &&
            payment.payment_status === "success"
        ) {
            await transaction.commit();
            transaction = null;

            return {
                verified: true,
                message: "Payment already verified"
            };
        }

        if (order.payment_status === "paid") {
            throw createError("Order has already been paid");
        }

        if (
            ["cancelled", "delivered", "returned"].includes(
                order.order_status
            )
        ) {
            throw createError("This order can no longer be paid");
        }

        const expectedAmount = Math.round(
            Number(order.total_amount) * 100
        );

        console.log("[VERIFY] Checking payment details", {
            razorpayOrderIdMatches:
                razorpayPayment.order_id === razorpay_order_id,
            paymentCaptured:
                razorpayPayment.status === "captured",
            // amountMatches:
            //     Number(razorpayPayment.amount) === expectedAmount,
            currencyMatches:
                razorpayPayment.currency === order.currency,
            gatewayOrderIdMatches:
                payment.gateway_order_id === razorpay_order_id
        });

        if (
            razorpayPayment.order_id !== razorpay_order_id ||
            razorpayPayment.status !== "captured" ||
            Number(razorpayPayment.amount) !== expectedAmount ||
            razorpayPayment.currency !== order.currency ||
            payment.gateway_order_id !== razorpay_order_id
        ) {
            throw createError(
                "Payment is not captured or its details do not match"
            );
        }

        await payment.update(
            { payment_status: "success" },
            { transaction }
        );

        await order.update(
            { payment_status: "paid" },
            { transaction }
        );

        await transaction.commit();
        transaction = null;

        console.log("[VERIFY] Payment verified successfully");

        return {
            verified: true,
            message: "Payment verified successfully",
            order_id: order.id,
            payment_id: razorpay_payment_id
        };
    } catch (error) {
        console.error("[VERIFY] Failed:", error.message);

        if (transaction && !transaction.finished) {
            await transaction.rollback();
        }

        throw error;
    }
};
