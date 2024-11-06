const axios = require('axios');

const apiService = axios.create({
    baseURL: 'http://localhost:5000/', // Your backend API base URL
    headers: {
        'Content-Type': 'application/json',
    },
});

module.exports = apiService;
