import { apiConnector } from './apiConnector';

// Notification API Calls
export const fetchNotifications = async () => {
  try {
    const response = await apiConnector('GET', '/notifications');
    return response.data; // Returns list of notifications
  } catch (error) {
    throw error; // Handle error accordingly
  }
};

// Exporting all notification-related functions
export default {
  fetchNotifications,
};
