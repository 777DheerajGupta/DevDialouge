const axios = require('axios');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
console.log(GITHUB_TOKEN);

const fetchTrendingGitHubRepos = async () => {
    const response = await axios.get('https://api.github.com/search/repositories?q=language:javascript&sort=stars&order=desc', {
        headers: {
            Authorization: `token ${GITHUB_TOKEN}`
        }
    });
    return response.data.items;
};

module.exports = { fetchTrendingGitHubRepos };
