
'use strict';

const razorpayService = require('../services/razorpay_service');

exports.createOrder = async (req, res) => {
    try {
        const { orderId } = req.body;

        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: 'orderId is required'
            });
        }

        const data = await razorpayService.createRazorpayOrder(
            orderId,
            req.user.id
        );

        return res.status(201).json({
            success: true,
            message: 'Razorpay order created successfully',
            data
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const data = await razorpayService.verifyRazorpayPayment(
            req.body,
            req.user.id
        );

        return res.status(200).json({
            success: true,
            message: data.message,
            data
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};
