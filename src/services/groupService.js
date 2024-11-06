import { apiConnector } from "../api/apiConnector";

export const createGroup = async (groupData) => {
  try {
    const response = await apiConnector('POST', '/groups', groupData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error creating group');
  }
};

export const getUserGroups = async () => {
  try {
    const response = await apiConnector('GET', '/groups/user-groups');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching groups');
  }
};

export const getGroupDetails = async (groupId) => {
  try {
    const response = await apiConnector('GET', `/groups/${groupId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching group details');
  }
};

export const updateGroup = async (groupId, updateData) => {
  try {
    const response = await apiConnector('PUT', `/groups/${groupId}`, updateData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error updating group');
  }
};

export const addMember = async (groupId, userId) => {
  try {
    const response = await apiConnector('POST', `/groups/${groupId}/add-member`, { userId });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error adding member');
  }
};

export const removeMember = async (groupId, userId) => {
  try {
    const response = await apiConnector('POST', `/groups/${groupId}/remove-member`, { userId });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error removing member');
  }
};

export const deleteGroup = async (groupId) => {
  try {
    const response = await apiConnector('DELETE', `/groups/${groupId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error deleting group');
  }
};

export const getGroupMessages = async (groupId) => {
  try {
    const response = await apiConnector('GET', `/groups/${groupId}/messages`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching messages');
  }
};

export const sendGroupMessage = async (groupId, content) => {
  try {
    const response = await apiConnector('POST', `/groups/${groupId}/messages`, { content });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error sending message');
  }
}; 