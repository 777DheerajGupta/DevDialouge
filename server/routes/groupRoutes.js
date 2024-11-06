const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
    createGroup,
    getGroup,
    updateGroup,
    deleteGroup,
    sendGroupMessage,
    addMember,
    removeMember,
    getAllGroups,
    getGroupMessages,
    markMessagesAsRead,
    makeUserAdmin,
    leaveGroup
} = require('../controllers/groupController');

// Group CRUD
router.post('/', authMiddleware, createGroup);
router.get('/all', authMiddleware, getAllGroups);  // Get all user's groups
router.get('/:groupId', authMiddleware, getGroup);
router.put('/:groupId', authMiddleware, updateGroup);
router.delete('/:groupId', authMiddleware, deleteGroup);

// Messages
router.get('/:groupId/messages', authMiddleware, getGroupMessages);
router.post('/:groupId/messages', authMiddleware, sendGroupMessage);
router.put('/:groupId/messages/read', authMiddleware, markMessagesAsRead);

// Member management
router.post('/:groupId/members', authMiddleware, addMember);
router.delete('/:groupId/members/:userId', authMiddleware, removeMember);
router.post('/:groupId/admins/:userId', authMiddleware, makeUserAdmin);
router.post('/:groupId/leave', authMiddleware, leaveGroup);

module.exports = router;
