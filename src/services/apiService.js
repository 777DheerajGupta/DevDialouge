import axios from 'axios';

const RAPIDAPI_KEY = process.env.REACT_APP_RAPIDAPI_KEY;

export const getAINews = async () => {
  const options = {
    method: 'GET',
    url: 'https://ai-news3.p.rapidapi.com/ai/news/recent',
    headers: {
      'X-RapidAPI-Key': RAPIDAPI_KEY,
      'X-RapidAPI-Host': 'ai-news3.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch AI news');
  }
}; 