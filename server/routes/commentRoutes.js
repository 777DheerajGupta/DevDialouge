const express = require('express');
const {
    createComment,
    deleteComment,
    getCommentsByPostId,
    getCommentsByQuestionId,
    updateComment
} = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Route for adding a comment to a post
router.post('/post/:postId', authMiddleware, createComment);

// Route for adding a comment to a question
router.post('/question/:questionId', authMiddleware, createComment);

// Route for deleting a comment by ID
router.delete('/:id', authMiddleware, deleteComment);

// Route for getting all comments for a specific post
router.get('/post/:postId', getCommentsByPostId);

// Route for getting all comments for a specific question
router.get('/question/:questionId', getCommentsByQuestionId);

router.put('/:id', authMiddleware, updateComment);

module.exports = router;
