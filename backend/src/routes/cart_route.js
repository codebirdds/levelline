
const express = require('express');

const router = express.Router();

const controller = require('../controllers/cart_controller');

const authMiddleware = require('../middlewares/authMiddleware');

// 🔐 Authenticated user routes

// Add item to cart
router.post('/', authMiddleware, controller.create);

// Update item quantity
router.put('/:id', authMiddleware, controller.update);

// Remove item from cart
router.delete('/:id', authMiddleware, controller.remove);

// 🌍 Authenticated user's cart
router.get('/', authMiddleware, controller.getAll);

// Get a specific cart item
router.get('/:id', authMiddleware, controller.getById);

module.exports = router;