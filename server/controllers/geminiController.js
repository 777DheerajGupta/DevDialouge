const { GoogleGenerativeAI } = require("@google/generative-ai");
const AiChat = require('../models/AiChat');
require('dotenv').config();

const GENAI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GENAI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

module.exports = {
    // Create new chat
    createChat: async (req, res) => {
        try {
            if (!req.user || !req.user._id) {
                return res.status(401).json({
                    success: false,
                    message: "User not authenticated"
                });
            }

            const chat = await AiChat.create({
                user: req.user._id,
                title: 'New Chat'
            });

            res.status(201).json({
                success: true,
                data: chat
            });
        } catch (error) {
            console.error("Error creating chat:", error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    // Send message in a specific chat
    sendMessage: async (req, res) => {
        try {
            const { chatId } = req.params;
            const { message } = req.body;
            const userId = req.user._id;

            // Find the chat and verify ownership
            const chat = await AiChat.findOne({ _id: chatId, user: userId });
            if (!chat) {
                return res.status(404).json({
                    success: false,
                    message: "Chat not found"
                });
            }

            // Generate AI response
            const result = await model.generateContent(message);
            const aiResponse = result.response.text();

            // Update chat with new messages
            chat.messages.push(
                { role: 'user', content: message },
                { role: 'assistant', content: aiResponse }
            );

            // Update chat title if it's the first message
            if (chat.messages.length === 2) {
                chat.title = message.slice(0, 30) + (message.length > 30 ? '...' : '');
            }

            await chat.save();

            res.status(200).json({
                success: true,
                data: {
                    message: aiResponse,
                    chatId: chat._id
                }
            });
        } catch (error) {
            console.error("Error sending message:", error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    // Get all chats for a user
    getAllChats: async (req, res) => {
        try {
            const userId = req.user._id;
            const chats = await AiChat.find({ 
                user: userId,
                isActive: true 
            })
            .select('title messages.timestamp')
            .sort('-updatedAt');

            res.status(200).json({
                success: true,
                data: chats
            });
        } catch (error) {
            console.error("Error fetching chats:", error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    // Get specific chat history
    getChatById: async (req, res) => {
        try {
            const { chatId } = req.params;
            const userId = req.user._id;

            const chat = await AiChat.findOne({
                _id: chatId,
                user: userId,
                isActive: true
            });

            if (!chat) {
                return res.status(404).json({
                    success: false,
                    message: "Chat not found"
                });
            }

            res.status(200).json({
                success: true,
                data: chat
            });
        } catch (error) {
            console.error("Error fetching chat:", error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    // Delete a chat (soft delete)
    deleteChat: async (req, res) => {
        try {
            const { chatId } = req.params;
            const userId = req.user._id;

            const chat = await AiChat.findOneAndUpdate(
                { _id: chatId, user: userId },
                { isActive: false },
                { new: true }
            );

            if (!chat) {
                return res.status(404).json({
                    success: false,
                    message: "Chat not found"
                });
            }

            res.status(200).json({
                success: true,
                message: "Chat deleted successfully"
            });
        } catch (error) {
            console.error("Error deleting chat:", error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    // Clear all chats
    clearAllChats: async (req, res) => {
        try {
            const userId = req.user._id;
            await AiChat.updateMany(
                { user: userId },
                { isActive: false }
            );

            res.status(200).json({
                success: true,
                message: "All chats cleared successfully"
            });
        } catch (error) {
            console.error("Error clearing chats:", error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
};
