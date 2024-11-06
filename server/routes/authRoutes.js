const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
    login,
    signup,
    forgotPassword,
    verifyOtpAndResetPassword,
    changePassword,
    sendOtp
} = require('../controllers/authController');

// Existing routes
router.post('/login', login);
router.post('/signup', signup);
router.post('/forgot-password', sendOtp);
router.post('/reset-password', verifyOtpAndResetPassword);

// Add change password route (protected)
router.post('/change-password', authMiddleware, changePassword);

module.exports = router;
