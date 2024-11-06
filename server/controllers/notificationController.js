const Notification = require('../models/Notification');

// Create a notification
const createNotification = async (req, res) => {
    try {
        const { userId, message } = req.body;

        const notification = new Notification({
            user: userId,
            message,
            read: false,
        });

        await notification.save();
        // Emit the notification to the specific user using Socket.io
        req.io.to(userId).emit('newNotification', notification);

        res.status(201).json({ success: true, data: notification });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get notifications for a user
const getUserNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: notifications });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Mark a notification as read
const markNotificationAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;

        const notification = await Notification.findByIdAndUpdate(
            notificationId,
            { read: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }

        res.status(200).json({ success: true, data: notification });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a notification
const deleteNotification = async (req, res) => {
    try {
        const { notificationId } = req.params;

        const notification = await Notification.findByIdAndDelete(notificationId);

        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }

        res.status(200).json({ success: true, message: 'Notification deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createNotification,
    getUserNotifications,
    markNotificationAsRead,
    deleteNotification,
};
