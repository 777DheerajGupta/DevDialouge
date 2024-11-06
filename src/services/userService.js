import { apiConnector } from '../api/apiConnector';

// Get user profile
export const getUserProfile = async (userId) => {
  try {
    const response = await apiConnector('GET', `/users/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching user profile: ' + error.message);
  }
};

// Update user profile (protected)
export const updateUserProfile = async (updateData) => {
  try {
    const response = await apiConnector('PUT', '/users/profile', updateData);
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('Please login to update your profile');
    }
    throw new Error('Error updating profile: ' + error.message);
  }
};

// Change password (protected)
export const changePassword = async (passwordData) => {
  try {
    const response = await apiConnector('PUT', '/users/password', passwordData);
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('Please login to change password');
    }
    throw new Error('Error changing password: ' + error.message);
  }
};

// Get user activity (posts, comments, etc.)
export const getUserActivity = async (userId) => {
  try {
    const response = await apiConnector('GET', `/users/${userId}/activity`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching user activity: ' + error.message);
  }
};

// Delete user account (protected)
export const deleteUserAccount = async () => {
  try {
    const response = await apiConnector('DELETE', '/users/account');
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('Please login to delete your account');
    }
    throw new Error('Error deleting account: ' + error.message);
  }
}; 