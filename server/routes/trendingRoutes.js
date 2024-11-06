const express = require('express');
const { getTrendingTopics } = require('../controllers/trendingController');

const router = express.Router();

router.get('/trending', getTrendingTopics);

module.exports = router;
