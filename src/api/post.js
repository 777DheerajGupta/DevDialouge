import { apiConnector } from './apiConnector';

// Create a new Post
export const createPost = async (postData) => {
  try {
    const response = await apiConnector('POST', '/post', postData);
    return response.data; // Returns created post data
  } catch (error) {
    throw error; // Handle error accordingly
  }
};

// Fetch All Posts
export const fetchPosts = async () => {
  try {
    const response = await apiConnector('GET', '/post');
    return response.data; // Returns a list of posts
  } catch (error) {
    throw error; // Handle error accordingly
  }
};

// Fetch Single Post by ID
export const fetchPostById = async (postId) => {
  try {
    const response = await apiConnector('GET', `/post/${postId}`);
    return response.data; // Returns the post details
  } catch (error) {
    throw error; // Handle error accordingly
  }
};

// Update an Existing Post
export const updatePost = async (postId, updatedData) => {
  try {
    const response = await apiConnector('PUT', `/post/${postId}`, updatedData);
    return response.data; // Returns updated post data
  } catch (error) {
    throw error; // Handle error accordingly
  }
};

// Delete a Post
export const deletePost = async (postId) => {
  try {
    await apiConnector('DELETE', `/post/${postId}`);
    return postId; // Returns deleted post ID for confirmation
  } catch (error) {
    throw error; // Handle error accordingly
  }
};

// Like/Upvote a Post
export const likePost = async (postId) => {
  try {
    const response = await apiConnector('POST', `/post/${postId}/like`);
    return response.data; // Returns updated post with new like count
  } catch (error) {
    throw error; // Handle error accordingly
  }
};

// Unlike/Remove Upvote from a Post
export const unlikePost = async (postId) => {
  try {
    const response = await apiConnector('POST', `/post/${postId}/unlike`);
    return response.data; // Returns updated post with updated like count
  } catch (error) {
    throw error; // Handle error accordingly
  }
};

// Exporting all post-related functions
export default {
  createPost,
  fetchPosts,
  fetchPostById,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
};
