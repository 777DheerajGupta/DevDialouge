const redditConfig = {
    tokenUrl: 'https://www.reddit.com/api/v1/access_token',
    subredditUrl: 'https://oauth.reddit.com/r/programming/hot.json',
    clientId: process.env.REDDIT_CLIENT_ID,
    clientSecret: process.env.REDDIT_CLIENT_SECRET,
  };
  
  module.exports = {
    newsAPI: {
      url: `https://newsapi.org/v2/everything?q=programming&apiKey=${process.env.NEWS_API_KEY}`,
    },
    redditAPI: redditConfig,
    githubTrendingAPI: {
      url: `https://api.github.com/search/repositories?q=trending&sort=stars&order=desc&access_token=${process.env.GITHUB_TRENDING_API_KEY}`,
    },
  };
  