
const express = require('express');

const router = express.Router();

const controller = require('../controllers/address_controller');
const authMiddleware = require('../middlewares/authMiddleware');

// 🔐 Authenticated user routes

// Add new address
router.post('/', authMiddleware, controller.create);

// Get all addresses of logged-in user
router.get('/', authMiddleware, controller.getAll);

// Get address by ID
router.get('/:id', authMiddleware, controller.getById);

// Update address
router.put('/:id', authMiddleware, controller.update);

// Delete address
router.delete('/:id', authMiddleware, controller.remove);

// Set default address
router.patch('/:id/default', authMiddleware, controller.setDefault);

module.exports = router;
