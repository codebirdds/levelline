const express = require('express');
const router = express.Router();

const controller = require('../controllers/product_controller');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/uploadMiddleware');


// 🔐 Admin only
router.post(
    '/',
    authMiddleware,
    roleMiddleware('admin'),
    upload.array('images', 5),
    controller.create
);
router.put('/:id', authMiddleware, roleMiddleware('admin'), upload.array('images', 5), controller.update);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), controller.remove);

router.get('/', controller.getAll);
router.get('/:id', controller.getById);

module.exports = router;