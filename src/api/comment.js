import { apiConnector } from './apiConnector';

// Add a Comment to a Post or Question
export const addComment = async (parentId, commentData) => {
  try {
    const response = await apiConnector('POST', `/comment/${parentId}`, commentData);
    return response.data; // Returns the created comment data
  } catch (error) {
    throw error; // Handle error accordingly
  }
};

// Fetch Comments for a Specific Post or Question
export const fetchCommentsByParentId = async (parentId) => {
  try {
    const response = await apiConnector('GET', `/comment/${parentId}`);
    return response.data; // Returns list of comments for the specified post or question
  } catch (error) {
    throw error; // Handle error accordingly
  }
};

// Update a Comment
export const updateComment = async (commentId, updatedData) => {
  try {
    const response = await apiConnector('PUT', `/comment/${commentId}`, updatedData);
    return response.data; // Returns updated comment data
  } catch (error) {
    throw error; // Handle error accordingly
  }
};

// Delete a Comment
export const deleteComment = async (commentId) => {
  try {
    await apiConnector('DELETE', `/comment/${commentId}`);
    return commentId; // Returns deleted comment ID for confirmation
  } catch (error) {
    throw error; // Handle error accordingly
  }
};

// Exporting all comment-related functions
export default {
  addComment,
  fetchCommentsByParentId,
  updateComment,
  deleteComment,
};
