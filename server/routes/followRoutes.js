const express = require('express');
const {
  sendFollowRequest,
  unfollowUser,
  getFollowers,
  getFollowing
} = require('../controllers/followController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Route for sending a follow request
router.post('/:userId/follow', authMiddleware, sendFollowRequest);


// Route for rejecting a follow request
router.patch('/:requestId/reject', authMiddleware, unfollowUser);


// Route for getting a list of followers
router.get('/followers', authMiddleware, getFollowers);

// Route for getting a list of users the authenticated user is following
router.get('/following', authMiddleware, getFollowing);

module.exports = router;
