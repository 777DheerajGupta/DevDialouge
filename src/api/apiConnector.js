import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:5000/api/v1';

export const apiConnector = async (method, endpoint, data = null, isFormData = false) => {
  try {
    const token = localStorage.getItem('token');
    const fullUrl = `${BASE_URL}${endpoint}`;

    // Config for axios request
    const config = {
      method,
      url: fullUrl,
      headers: {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...(token && { 'Authorization': `Bearer ${token}` }), // Add Authorization only if token exists
      },
      ...(method !== 'GET' && method !== 'DELETE' && data ? { data } : {}),
    };

    // If it's FormData, add special config
    if (isFormData) {
      config.transformRequest = [function (data) {
        return data; // Return FormData as-is
      }];
    }

    // Make the API call
    const response = await axios(config);
    console.log('API Response:', response);
    return response; // Return only response data
  } catch (error) {
    console.error('API Error:', {
      status: error.response?.status || 'Unknown',
      data: error.response?.data || 'No response data',
      message: error.response?.data?.message || error.message,
      endpoint,
    });
    throw error;
  }
};
