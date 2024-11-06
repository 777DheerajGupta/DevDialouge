const mongoose = require("mongoose")
const Chat = require('../models/Chat');
const User = require('../models/User');
const {getIo} = require("../config/chatSocket")

// Send a message in a private chat
const sendPrivateMessage = async (req, res) => {
    try {
        const { recipient, content } = req.body;
        const sender = req.user._id;

        // Validate input
        if (!content || !recipient) {
            return res.status(400).json({
                success: false,
                message: 'Content and recipient are required'
            });
        }

        const newMessage = await Chat.create({
            sender,
            recipient,
            content,
            isRead: false  // Initially message is unread
        });

        const populatedMessage = await Chat.findById(newMessage._id)
            .populate('sender', 'name profilePicture')
            .populate('recipient', 'name profilePicture');

        res.status(201).json({
            success: true,
            data: populatedMessage
        });

    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Send a message in a group chat
const sendGroupMessage = async (req, res) => {
    try {
        const { groupId, message } = req.body;

        const chat = new Chat({
            sender: req.user.id,
            group: groupId,
            message,
            chatType: 'group',
        });

        await chat.save();
        // Emit the message to all members of the group using Socket.io
        const io = getIo()
        io.to(groupId).emit('groupMessage', chat);

        res.status(200).json({ success: true, data: chat });
    } catch (error) {
        console.log("error aa gya hai" , error)
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get chat history with a user
const getPrivateChatHistory = async (req, res) => {
    try {
        const { recipientId } = req.params;
        const userId = req.user._id;

        console.log("userId", userId)
        console.log("receiverId", recipientId)

        const messages = await Chat.find({
            $or: [
                { sender: userId, recipient: recipientId },
                { sender: recipientId, recipient: userId }
            ]
        })
        .populate('sender', 'name profilePicture')
        .populate('recipient', 'name profilePicture')
        .sort({ createdAt: 1 });

        res.status(200).json({
            success: true,
            data: messages
        });
    } catch (error) {
        console.error('Error fetching chat history:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



// Get group chat history
const getGroupChatHistory = async (req, res) => {
    try {
        const { groupId } = req.params;

        const chatHistory = await Chat.find({ group: groupId }).sort({ createdAt: 1 });
        console.log("chatHistory" , chatHistory)

        res.status(200).json({ success: true, data: chatHistory });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getChatHistoryWithUser = async (req, res) => {
    try {
        const { userId } = req.params;  // Target user ID
        const currentUserId = req.user._id;  // Current user ID from auth

        // Validate users exist
        const [targetUser, currentUser] = await Promise.all([
            User.findById(userId),
            User.findById(currentUserId)
        ]);

        if (!targetUser || !currentUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Get messages between these two users
        const messages = await Chat.find({
            $or: [
                { sender: currentUserId, recipient: userId },
                { sender: userId, recipient: currentUserId }
            ]
        })
        .populate('sender', 'name profilePicture')
        .populate('recipient', 'name profilePicture')
        .sort({ createdAt: 1 });

        // Get user details for the chat header
        const chatUser = {
            _id: targetUser._id,
            name: targetUser.name,
            profilePicture: targetUser.profilePicture,
            // Add any other user details you want to include
        };

        res.status(200).json({
            success: true,
            data: {
                messages,
                user: chatUser,
                count: messages.length
            }
        });

    } catch (error) {
        console.error('Error fetching chat history:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching chat history',
            error: error.message
        });
    }
};

// Update read status when user opens chat
const updateReadStatus = async (req, res) => {
    try {
        const { senderId } = req.params;  // ID of the other user
        const receiverId = req.user._id;   // Current user's ID

        // Update all unread messages in this conversation
        await Chat.updateMany(
            {
                sender: senderId,
                receiver: receiverId,
                isRead: false
            },
            {
                isRead: true
            }
        );

        res.status(200).json({
            success: true,
            message: 'Messages marked as read'
        });

    } catch (error) {
        console.error('Error updating read status:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating read status'
        });
    }
};

module.exports = {
    sendPrivateMessage,
    sendGroupMessage,
    getPrivateChatHistory,
    getGroupChatHistory,
    getChatHistoryWithUser,
    updateReadStatus
};

