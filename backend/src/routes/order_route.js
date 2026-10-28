
const express = require('express');
const router = express.Router();

const orderController = require('../controllers/order_controller');
const razorpayController = require('../controllers/razorpay_controller');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Customer routes
router.post('/', authMiddleware, orderController.create);
router.get('/', authMiddleware, orderController.getAll);
router.get('/:id', authMiddleware, orderController.getById);
router.patch('/:id/cancel', authMiddleware, orderController.cancel);

//Razor pay
router.post('/razorpay-order', authMiddleware, razorpayController.createOrder);
router.post('/verify-razorpay-payment', authMiddleware, razorpayController.verifyPayment);

// Admin routes
router.get(
  '/admin/all',
  authMiddleware,
  roleMiddleware('admin'),
  orderController.adminGetAll
);

router.get(
  '/admin/:id',
  authMiddleware,
  roleMiddleware('admin'),
  orderController.adminGetById
);

router.patch(
  '/admin/:id/status',
  authMiddleware,
  roleMiddleware('admin'),
  orderController.adminUpdateStatus
);

console.log('authMiddleware:', typeof authMiddleware);
console.log('roleMiddleware:', typeof roleMiddleware);
console.log(
  'roleMiddleware result:',
  typeof roleMiddleware('admin')
);
console.log(
  'markAsDeliver:',
  typeof orderController.markAsDeliver
);

router.patch(
  '/admin/deliver/:order_id',
  authMiddleware,
  roleMiddleware('admin'),
  orderController.markAsDeliver
);

module.exports = router;
