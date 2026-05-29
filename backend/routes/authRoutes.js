const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.post('/signup',         authController.signup);
router.post('/login',          authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password',  authController.resetPassword);
router.post('/update-password', authController.updatePassword);

// Protected routes
router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;
