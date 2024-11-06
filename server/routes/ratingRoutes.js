const express = require('express');
const {
    createRating,
    getRatingsByPostId,
    getRatingsByUserId,
    updateRating,
    deleteRating,
} = require('../controllers/ratingController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Route for rating a post
router.post('/posts/:postId', authMiddleware, createRating);

// Route for rating a user
router.post('/users/:userId', authMiddleware, createRating);

// Route for updating an existing rating
router.patch('/:ratingId', authMiddleware, updateRating);

// Route for deleting a rating
router.delete('/:ratingId', authMiddleware, deleteRating);

// Route for getting all ratings for a specific post
router.get('/posts/:postId', authMiddleware, getRatingsByPostId);

// Route for getting all ratings for a specific user
router.get('/users/:userId', authMiddleware, getRatingsByUserId);

module.exports = router;
