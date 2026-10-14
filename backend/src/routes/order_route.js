
const express = require('express');
const router = express.Router();

const orderController = require('../controllers/order_controller');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Customer routes
router.post('/', authMiddleware, orderController.create);
router.get('/', authMiddleware, orderController.getAll);
router.get('/:id', authMiddleware, orderController.getById);
router.patch('/:id/cancel', authMiddleware, orderController.cancel);

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

router.patch(
  '/admin/deliver/:orderId',
  authMiddleware,
  roleMiddleware('admin'),
  orderController.markAsDeliver
);

module.exports = router;
