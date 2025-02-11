import { apiConnector } from './apiConnector';

// Fetch Chat History between two users
export const fetchChatHistory = async (userId) => {
  try {
    const response = await apiConnector('GET', `/chat/history/${userId}`);
    return response.data; // Returns chat history between authenticated user and specified user
  } catch (error) {
    throw error; // Handle error accordingly
  }
};

// Send Message in Private Chat
export const sendMessage = async (recipientId, messageData) => {
  try {
    const response = await apiConnector('POST', `/chat/send/${recipientId}`, messageData);
    return response.data; // Returns details of the sent message
  } catch (error) {
    throw error; // Handle error accordingly
  }
};

// Fetch Group Chat History
export const fetchGroupChatHistory = async (groupId) => {
  try {
    const response = await apiConnector('GET', `/chat/group/${groupId}/history`);
    return response.data; // Returns chat history for the specified group
  } catch (error) {
    throw error; // Handle error accordingly
  }
};

// Send Message in Group Chat
export const sendGroupMessage = async (groupId, messageData) => {
  try {
    const response = await apiConnector('POST', `/chat/group/${groupId}/messages`, messageData);
    return response.data; // Returns details of the sent group message
  } catch (error) {
    throw error; // Handle error accordingly
  }
};

// Exporting all chat-related functions
export default {
  fetchChatHistory,
  sendMessage,
  fetchGroupChatHistory,
  sendGroupMessage,
};
