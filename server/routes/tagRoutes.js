const express = require('express');
const {
  createTag,
  updateTag,
  deleteTag,
  getTagById,
  getAllTags
} = require('../controllers/tagController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Route for creating a new tag
router.post('/', authMiddleware, createTag);

// Route for updating an existing tag
router.patch('/:tagId', authMiddleware, updateTag);

// Route for deleting a tag
router.delete('/:tagId', authMiddleware, deleteTag);

// Route for fetching a tag by ID
router.get('/:tagId', authMiddleware, getTagById);

// Route for fetching all tags
router.get('/', authMiddleware, getAllTags);

module.exports = router;
