const express = require('express');
const router = express.Router();
const controller = require('../controllers/site_media_controller');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const siteMediaUpload = require('../middlewares/siteMediaUpload');

router.post('/', authMiddleware, roleMiddleware('admin'), siteMediaUpload, controller.create);
router.patch('/:id', authMiddleware, roleMiddleware('admin'), siteMediaUpload, controller.update);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), controller.remove);
router.get('/', authMiddleware, roleMiddleware('admin'), controller.getAll);
router.get('/key/:key', controller.getByKey);

module.exports = router;
