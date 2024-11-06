import { apiConnector } from './apiConnector';

// User Authentication
export const loginUser = async (credentials) => {
  try {
    const response = await apiConnector('POST', '/auth/login', credentials);
    return response.data; // Returns user data (including token)
  } catch (error) {
    throw error; // Handle error accordingly
  }
};

export const signupUser = async (userData) => {
  try {
    const response = await apiConnector('POST', '/auth/signup', userData);
    return response.data; // Returns created user data
  } catch (error) {
    throw error; // Handle error accordingly
  }
};

export const fetchUserProfile = async (userId) => {
  try {
    const response = await apiConnector('GET', `/users/${userId}`);
    return response.data; // Returns user profile data
  } catch (error) {
    throw error; // Handle error accordingly
  }
};

// Example of updating user profile
export const updateUserProfile = async (userId, updateData) => {
  try {
    const response = await apiConnector('PUT', `/user/${userId}`, updateData);
    return response.data; // Returns updated user profile data
  } catch (error) {
    throw error; // Handle error accordingly
  }
};

// Example of fetching notifications
export const fetchNotifications = async () => {
  try {
    const response = await apiConnector('GET', '/notifications');
    return response.data; // Returns list of notifications
  } catch (error) {
    throw error; // Handle error accordingly
  }
};

// Example of sending follow request
export const sendFollowRequest = async (userId) => {
  try {
    const response = await apiConnector('POST', `/follow/send/${userId}`);
    return response.data; // Returns follow request response
  } catch (error) {
    throw error; // Handle error accordingly
  }
};

// Example of accepting follow request
export const acceptFollowRequest = async (requestId) => {
  try {
    const response = await apiConnector('POST', `/follow/accept/${requestId}`);
    return response.data; // Returns accepted request response
  } catch (error) {
    throw error; // Handle error accordingly
  }
};

// Example of rejecting follow request
export const rejectFollowRequest = async (requestId) => {
  try {
    const response = await apiConnector('POST', `/follow/reject/${requestId}`);
    return response.data; // Returns rejected request response
  } catch (error) {
    throw error; // Handle error accordingly
  }
};

// Exporting all user-related functions
export default {
  loginUser,
  signupUser,
  fetchUserProfile,
  updateUserProfile,
  fetchNotifications,
  sendFollowRequest,
  acceptFollowRequest,
  rejectFollowRequest,
};
