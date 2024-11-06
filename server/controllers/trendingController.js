const { fetchTrendingGitHubRepos } = require('../api/github');
const { fetchTrendingNews } = require('../api/news');
const { fetchTrendingRedditPosts } = require('../api/reddit');
const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 600 }); // Cache for 10 minutes

const getTrendingTopics = async (req, res) => {
    try {
        // Check cache for GitHub repositories
        let githubRepos = cache.get('githubRepos');
        if (!githubRepos) {
            githubRepos = await fetchTrendingGitHubRepos();
            cache.set('githubRepos', githubRepos);
        }

        // Check cache for news articles
        let newsArticles = cache.get('newsArticles');
        if (!newsArticles) {
            newsArticles = await fetchTrendingNews();
            cache.set('newsArticles', newsArticles);
        }

        // Check cache for Reddit posts
        let redditPosts = cache.get('redditPosts');
        if (!redditPosts) {
            redditPosts = await fetchTrendingRedditPosts();
            cache.set('redditPosts', redditPosts);
        }

        res.status(200).json({
            github: githubRepos,
            news: newsArticles,
            reddit: redditPosts,
        });
    } catch (error) {
        console.error('Trending topics fetch error:', error);
        
        // Determine which service failed
        let errorSource = '';
        if (error.config && error.config.url) {
            if (error.config.url.includes('github')) errorSource = 'GitHub';
            else if (error.config.url.includes('news')) errorSource = 'News API';
            else if (error.config.url.includes('reddit')) errorSource = 'Reddit';
        }

        const statusCode = error.response?.status || 500;
        const errorMessage = errorSource 
            ? `Failed to fetch data from ${errorSource}: ${error.message}`
            : `Failed to fetch trending topics: ${error.message}`;

        res.status(statusCode).json({ 
            message: errorMessage,
            error: error.message,
            source: errorSource || 'unknown'
        });
    }
};

module.exports = { getTrendingTopics };
