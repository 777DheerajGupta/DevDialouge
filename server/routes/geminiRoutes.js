const express = require('express');
const router = express.Router();
const  authMiddleware  = require('../middleware/authMiddleware');
const { 
    createChat,
    sendMessage,
    getAllChats,
    getChatById,
    deleteChat,
    clearAllChats
} = require('../controllers/geminiController');

// Chat management routes
router.post('/chats', authMiddleware, createChat);
router.get('/chats', authMiddleware, getAllChats);
router.get('/chats/:chatId', authMiddleware, getChatById);
router.post('/chats/:chatId/messages', authMiddleware, sendMessage);
router.delete('/chats/:chatId', authMiddleware, deleteChat);
router.delete('/chats', authMiddleware, clearAllChats);

module.exports = router;