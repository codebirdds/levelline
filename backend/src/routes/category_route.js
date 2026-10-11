const express = require('express');
const router = express.Router();

const controller = require('../controllers/category_controller');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// 🔐 Admin only
router.post('/', authMiddleware, roleMiddleware('admin'), controller.create);
router.put('/:id', authMiddleware, roleMiddleware('admin'), controller.update);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), controller.remove);

// 🌍 Public
router.get('/', controller.getAll);
router.get('/:id', controller.getById);

module.exports = router;