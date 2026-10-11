const express = require('express');
const router = express.Router();

const controller = require('../controllers/product_controller');
const variantController = require('../controllers/product_variant_controller');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/uploadMiddleware');




// 🔐 Admin only
router.post(
    '/',
    authMiddleware,
    roleMiddleware('admin'),
    controller.create
);
router.put('/:id', authMiddleware, roleMiddleware('admin'), controller.update);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), controller.remove);

router.get('/', controller.getAll);
router.get('/:id', controller.getById);


// Admin only: Create variant
router.post(
    '/variant',
    authMiddleware,
    roleMiddleware('admin'),
    upload.array('images', 5),
    variantController.create
);

// Admin only: Update variant
router.put(
    '/variant/:id',
    authMiddleware,
    roleMiddleware('admin'),
    upload.array('images', 5),
    variantController.update
);

// Admin only: Delete variant
router.delete(
    '/variant/:id',
    authMiddleware,
    roleMiddleware('admin'),
    variantController.remove
);

// Public: Get all variants
router.get('/variant', variantController.getAll);

// Public: Get variant by ID
router.get('/variant/:id', variantController.getById);

module.exports = router;