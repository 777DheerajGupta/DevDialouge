const express = require('express');
const { sendPrivateMessage, sendGroupMessage, getPrivateChatHistory, getGroupChatHistory, getChatHistoryWithUser , updateReadStatus} = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/history/:userId', authMiddleware, getChatHistoryWithUser);
// Route for sending a private message
router.post('/private', authMiddleware, sendPrivateMessage);

// Route for sending a group message
router.post('/group', authMiddleware, sendGroupMessage);

// Route for getting chat history with a user
router.get('/private/:recieverId', authMiddleware, getPrivateChatHistory);

// Route for getting group chat history
router.get('/group/:groupId', authMiddleware, getGroupChatHistory);

router.put('/read/:senderId', authMiddleware, updateReadStatus);


module.exports = router;
// const express = require('express');
// const router = express.Router();
// const Chat = require('../models/Chat');

// // Get chat history between two users
// router.get('/chat/history/:recipientId', async (req, res) => {
//   try {
//     const messages = await Chat.find({
//       $or: [
//         { 
//           sender: req.user._id, 
//           recipient: req.params.recipientId 
//         },
//         { 
//           sender: req.params.recipientId, 
//           recipient: req.user._id 
//         }
//       ]
//     }).sort({ timestamp: 1 });

//     res.json(messages);
//   } catch (error) {
//     res.status(500).json({ error: 'Error fetching chat history' });
//   }
// });

// // Save a new message
// router.post('/chat/private', async (req, res) => {
//   try {
//     const { content, recipient } = req.body;
//     const newMessage = new Chat({
//       content,
//       sender: req.user._id,
//       recipient,
//       timestamp: new Date()
//     });

//     await newMessage.save();
//     res.status(201).json(newMessage);
//   } catch (error) {
//     res.status(500).json({ error: 'Error saving message' });
//   }
// });

// module.exports = router;

