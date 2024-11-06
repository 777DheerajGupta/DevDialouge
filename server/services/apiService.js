const axios = require("axios");
const apiConfig = require("../config/apiConfig");

const fetchRedditToken = async () => {
  try {
    const response = await axios.post(
      apiConfig.redditAPI.tokenUrl,
      new URLSearchParams({
        grant_type: 'client_credentials',
      }),
      {
        auth: {
          username: apiConfig.redditAPI.clientId,
          password: apiConfig.redditAPI.clientSecret,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error("Error fetching Reddit token:", error.message);
    return null;
  }
};


const fetchFromAPI = async (url, headers = {}) => {
    try {
      const response = await axios.get(url, { headers });
      return response.data;
    } catch (error) {
      console.error("Error fetching from API:", error.message);
      return null;
    }
  };
  
  const getTrendingData = async () => {
    const newsData = await fetchFromAPI(apiConfig.newsAPI.url);
    
    // Fetch Reddit data with token
    const redditToken = await fetchRedditToken();
    let redditData = null;
    if (redditToken) {
      redditData = await fetchFromAPI(apiConfig.redditAPI.subredditUrl, {
        Authorization: `Bearer ${redditToken}`,
      });
    }
  
    const githubData = await fetchFromAPI(apiConfig.githubTrendingAPI.url);
  
    // Consolidate data
    const trendingTopics = [];
  
    if (newsData?.articles) {
      newsData.articles.forEach((article) => {
        trendingTopics.push({
          title: article.title,
          link: article.url,
          source: "NewsAPI",
        });
      });
    }
  
    if (redditData?.data?.children) {
      redditData.data.children.forEach((post) => {
        trendingTopics.push({
          title: post.data.title,
          link: `https://reddit.com${post.data.permalink}`,
          source: "Reddit",
        });
      });
    }
  
    if (githubData?.items) {
      githubData.items.forEach((repo) => {
        trendingTopics.push({
          title: repo.name,
          link: repo.html_url,
          source: "GitHub",
        });
      });
    }
  
    return trendingTopics;
  };
  
  module.exports = {
    getTrendingData,
  };
  
