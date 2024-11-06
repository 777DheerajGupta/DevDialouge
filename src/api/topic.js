// src/api/topic.js
import {apiConnector} from './apiConnector' 

export const fetchTrendingTopics = async () => {
    try {
        const response = await apiConnector('GET', '/trending/trending'); // Adjust the URL as needed
        return response.data; // Assuming the data structure contains the trending topics
    } catch (error) {
        throw new Error("Failed to fetch trending topics");
    }
};
