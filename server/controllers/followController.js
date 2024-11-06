const User = require('../models/User');

// Send a follow request
const sendFollowRequest = async (req, res) => {
    try {
        const { userId } = req.params;

        // Check if the user is already following the recipient
        const alreadyFollowing = await User.findOne({
            _id: req.user.id,
            following: userId,
        });

        if (alreadyFollowing) {
            return res.status(400).json({ success: false, message: 'You are already following this user.' });
        }

        // Add to the user's following list and the recipient's followers list
        await User.findByIdAndUpdate(req.user.id, { $addToSet: { following: userId } });
        await User.findByIdAndUpdate(userId, { $addToSet: { followers: req.user.id } });

        res.status(201).json({ success: true, message: 'Followed successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Unfollow a user
const unfollowUser = async (req, res) => {
    try {
        const { userId } = req.params;

        // Remove from the user's following list and the recipient's followers list
        await User.findByIdAndUpdate(req.user.id, { $pull: { following: userId } });
        await User.findByIdAndUpdate(userId, { $pull: { followers: req.user.id } });

        res.status(200).json({ success: true, message: 'Unfollowed successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get followers for the authenticated user
const getFollowers = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('followers', 'name email');
        res.status(200).json({ success: true, data: user.followers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get following users for the authenticated user
const getFollowing = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('following', 'name email');
        res.status(200).json({ success: true, data: user.following });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    sendFollowRequest,
    unfollowUser,
    getFollowers,
    getFollowing,
};
