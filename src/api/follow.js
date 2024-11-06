import { apiConnector } from './apiConnector';

// Follow Request API Calls
export const sendFollowRequest = async (userId) => {
  try {
    const response = await apiConnector('POST', `/follow/send/${userId}`);
    return response.data; // Returns follow request response
  } catch (error) {
    throw error; // Handle error accordingly
  }
};

export const acceptFollowRequest = async (requestId) => {
  try {
    const response = await apiConnector('POST', `/follow/accept/${requestId}`);
    return response.data; // Returns accepted request response
  } catch (error) {
    throw error; // Handle error accordingly
  }
};

export const rejectFollowRequest = async (requestId) => {
  try {
    const response = await apiConnector('POST', `/follow/reject/${requestId}`);
    return response.data; // Returns rejected request response
  } catch (error) {
    throw error; // Handle error accordingly
  }
};

// Exporting all follow-related functions
export default {
  sendFollowRequest,
  acceptFollowRequest,
  rejectFollowRequest,
};
