const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,
    getAllUsers
} = require('../controllers/userController');

// Get all users
router.get('/all', getAllUsers);

// Existing routes
router.get('/:userId', authMiddleware, getUserProfile);
router.put('/:userId', authMiddleware, updateUserProfile);
router.delete('/:userId', authMiddleware, deleteUserProfile);

module.exports = router;
