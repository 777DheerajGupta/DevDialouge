const axios = require('axios');

const NEWS_API_KEY = process.env.NEWS_API_KEY;

const fetchTrendingNews = async () => {
    const response = await axios.get(`https://newsapi.org/v2/everything?q=programming&sortBy=popularity&apiKey=${NEWS_API_KEY}`);
    return response.data.articles;
};

module.exports = { fetchTrendingNews };
