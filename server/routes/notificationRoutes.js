const express = require('express');
const { 
    createNotification, 
    getUserNotifications, 
    markNotificationAsRead, 
    deleteNotification 
} = require('../controllers/notificationController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Route for creating a notification
router.post('/', authMiddleware, createNotification);

// Route for getting notifications for the authenticated user
router.get('/', authMiddleware, getUserNotifications);

// Route for marking a notification as read
router.patch('/:notificationId/read', authMiddleware, markNotificationAsRead);

// Route for deleting a notification
router.delete('/:notificationId', authMiddleware, deleteNotification);

module.exports = router;
