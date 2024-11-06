const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
    createPost,
    // createPostWithMedia,
    getUserPosts,
    getAllPosts,
    getPostById,
    updatePost,
    // updatePostWithMedia,
    deletePost,
    getPostsByTag
} = require('../controllers/postController');

// Create post (protected route)
router.post('/', authMiddleware, createPost);

// Get user's posts
router.get('/user/:userId', getUserPosts);

// Get all posts
router.get('/', getAllPosts);

// Get single post
router.get('/:id', getPostById);

// Update post (protected)
router.put('/:id', authMiddleware, updatePost);

// Delete post (protected)
router.delete('/:id', authMiddleware, deletePost);

// Get posts by tag
router.get('/tag/:tagName', getPostsByTag);

module.exports = router;
