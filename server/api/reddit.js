const axios = require('axios');

const REDDIT_CLIENT_ID = process.env.REDDIT_CLIENT_ID;
const REDDIT_CLIENT_SECRET = process.env.REDDIT_CLIENT_SECRET;

const fetchTrendingRedditPosts = async () => {
    const auth = {
        username: REDDIT_CLIENT_ID,
        password: REDDIT_CLIENT_SECRET
    };

    const response = await axios.post('https://www.reddit.com/api/v1/access_token', 
    new URLSearchParams({
        grant_type: 'client_credentials'
    }), {
        auth,
        headers: {
            'User-Agent': 'nodejs:ProgrammingTrendsApp:v1.0.0 (by /u/Wild-Resort-3347)'
        }
    });

    const token = response.data.access_token;

    const redditResponse = await axios.get('https://oauth.reddit.com/r/programming/hot.json', {
        headers: {
            Authorization: `Bearer ${token}`,
            'User-Agent': 'nodejs:ProgrammingTrendsApp:v1.0.0 (by /u/Wild-Resort-3347)'
        }
    });

    return redditResponse.data.data.children.map(child => child.data);
};

module.exports = { fetchTrendingRedditPosts };
