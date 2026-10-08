const express = require('express');
const router = express.Router();

const userController = require('../controllers/user_controller');

// register
router.post('/register', userController.register);

// login
router.post('/login', userController.login);

// login
router.post('/reset-password', userController.resetPassword);

module.exports = router;