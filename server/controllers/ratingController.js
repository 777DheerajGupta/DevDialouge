const Rating = require('../models/Rating');

// Create a new rating
const createRating = async (req, res) => {
    try {
        const { userId, postId, value } = req.body;

        const rating = new Rating({ userId, postId, value });
        await rating.save();

        res.status(201).json({ success: true, data: rating });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all ratings for a post
const getRatingsByPostId = async (req, res) => {
    try {
        const ratings = await Rating.find({ postId: req.params.postId });

        res.status(200).json({ success: true, data: ratings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all ratings by a user
const getRatingsByUserId = async (req, res) => {
    try {
        const ratings = await Rating.find({ userId: req.params.userId });

        res.status(200).json({ success: true, data: ratings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update a rating
const updateRating = async (req, res) => {
    try {
        const { value } = req.body;

        const rating = await Rating.findById(req.params.ratingId);
        if (!rating) {
            return res.status(404).json({ success: false, message: 'Rating not found' });
        }

        rating.value = value || rating.value;
        await rating.save();

        res.status(200).json({ success: true, data: rating });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a rating
const deleteRating = async (req, res) => {
    try {
        const rating = await Rating.findById(req.params.ratingId);
        if (!rating) {
            return res.status(404).json({ success: false, message: 'Rating not found' });
        }

        await rating.remove();
        res.status(200).json({ success: true, message: 'Rating deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createRating,
    getRatingsByPostId,
    getRatingsByUserId,
    updateRating,
    deleteRating,
};
