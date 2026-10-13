
const express = require('express');
const router = express.Router();

const paymentController = require('../controllers/payment_controller');
const authMiddleware = require('../middlewares/authMiddleware');

// Initiate payment for an order
router.post('/initiate', authMiddleware, paymentController.initiate);

// Verify payment status with the payment gateway
router.post('/verify', authMiddleware, paymentController.verify);

// Get payment attempts for a specific order
router.get('/order/:orderId', authMiddleware, paymentController.getByOrder);
router.get('/', authMiddleware, paymentController.findAllPayments);

module.exports = router;
