const User = require('../models/User');
const mongoose = require('mongoose')
const Post = require('../models/Post');

// Get user profile
const getUserProfile = async (req, res) => {
    try {
        const userId = req.params.userId;
        
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID format'
            });
        }

        // First, get the user with all references
        const user = await User.findById(userId)
            .populate({
                path: 'posts',
                options: { sort: { createdAt: -1 } }  // Sort posts by creation date
            })
            .populate('questions')
            .populate('answers')
            .populate('followers', 'name email profilePicture')
            .populate('following', 'name email profilePicture')
            .select('-password')
            .lean();  // Convert to plain JavaScript object

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Double check the posts array length
        console.log('Raw posts array:', user.posts);  // Debug log

        // Verify posts in database directly
        const postsCount = await Post.countDocuments({ author: userId });
        console.log('Actual posts count:', postsCount);  // Debug log

        const formattedUser = {
            _id: user._id,
            name: user.name,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            stats: {
                posts: postsCount,  // Use the actual count from database
                questions: user.questions?.length || 0,
                answers: user.answers?.length || 0,
                reputation: user.reputation || 0,
                followers: user.followers?.length || 0,
                following: user.following?.length || 0
            },
            posts: user.posts || [],
            questions: user.questions || [],
            answers: user.answers || [],
            followers: user.followers || [],
            following: user.following || [],
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

        res.status(200).json({
            success: true,
            data: formattedUser
        });

    } catch (error) {
        console.error('Error in getUserProfile:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update user profile
const updateUserProfile = async (req, res) => {
    try {
        const { name, email } = req.body;

        const updatedData = {};
        if (name) updatedData.name = name;
        if (email) updatedData.email = email;
        // if (password) updatedData.password = password; // Make sure to hash this password in the model or middleware

        const user = await User.findByIdAndUpdate(req.user.id, updatedData, { new: true, runValidators: true }).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete user profile
const deleteUserProfile = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, message: 'User profile deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Add this new controller function
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select('name email profilePicture bio posts questions answers')
            .populate('posts')
            .populate('questions')
            .populate('answers')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: users,
            count: users.length
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,
    getAllUsers,
};
