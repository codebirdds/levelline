const express = require('express');
const router = express.Router();

const contactController = require('../controllers/contact_controller');
const { authenticate, requireAdmin } = require('../middlewares/auth');

// Create contact (public route - no auth required)
router.post('/', contactController.createContact);

// Get all contacts (admin only)
router.get('/', authenticate, requireAdmin, contactController.getAllContacts);

// Get contact by ID (admin only)
router.get('/:id', authenticate, requireAdmin, contactController.getContactById);

// Update contact status (admin only)
router.put('/:id/status', authenticate, requireAdmin, contactController.updateContactStatus);

module.exports = router;