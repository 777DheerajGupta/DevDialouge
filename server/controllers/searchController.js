const User = require('../models/User');
const Post = require('../models/Post');
const Question = require('../models/Question');

// Search for users, posts, or questions
const searchItems = async (req, res) => {
    try {
        const { query } = req.body;

        const users = await User.find({
            username: { $regex: query, $options: 'i' } // Case-insensitive search
        });

        const posts = await Post.find({
            title: { $regex: query, $options: 'i' }
        });

        const questions = await Question.find({
            questionText: { $regex: query, $options: 'i' }
        });

        res.status(200).json({
            success: true,
            data: {
                users,
                posts,
                questions,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    searchItems,
};
