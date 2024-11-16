import { apiConnector } from '../api/apiConnector';
import axios from 'axios';

// Create a new post (protected)
export const createPost = async (postData) => {
  try {
    const response = await apiConnector('POST', '/posts', postData);
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('Please login to create a post');
    }
    throw new Error('Error creating post: ' + error.message);
  }
};

// Get user's posts
export const getUserPosts = async (userId) => {
  try {
    const response = await apiConnector('GET', `/posts/user/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching user posts: ' + error.message);
  }
};

// Get all posts
export const getAllPosts = async () => {
  try {
    const response = await apiConnector('GET', '/posts');
    return response.data;
  } catch (error) {
    throw new Error('Error fetching posts: ' + error.message);
  }
};

// Get single post by ID
export const getPostById = async (postId) => {
  try {
    const response = await apiConnector('GET', `/posts/${postId}`);
    // console.log("post response", response.data.data);
    return response.data.data;
  } catch (error) {
    throw new Error('Error fetching post: ' + error.message);
  }
};

// Update post (protected)
export const updatePost = async (postId, formData) => {
  try {
    const token = localStorage.getItem('token'); // If you're using token auth
    
    const response = await apiConnector('PUT', `/posts/${postId}`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`, // If using token auth
        // Don't set Content-Type, let browser set it with boundary for FormData
      }
    });

    return response.data;
  } catch (error) {
    console.error('Update post error:', error.response || error);
    throw error.response?.data || error.message;
  }
};

// Delete post (protected)
export const deletePost = async (postId) => {
  try {
    const response = await apiConnector('DELETE', `/posts/${postId}`);
    
    // Handle both empty and JSON responses
    if (response.status >= 200 && response.status < 300) {
      return { success: true };
    }
    
    throw new Error('Failed to delete post');
  } catch (error) {
    console.error('Delete error details:', error);
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      throw new Error('Please login to delete this post');
    }
    if (error.response?.status === 403) {
      throw new Error('You do not have permission to delete this post');
    }
    if (error.response?.status === 404) {
      throw new Error('Post not found');
    }
    if (error.response?.status === 500) {
      throw new Error('Server error occurred while deleting post');
    }
    
    // Generic error
    throw new Error('Error deleting post: ' + (error.message || 'Unknown error'));
  }
};


// Get comments for a post
export const getPostComments = async (postId) => {
  try {
    const response = await apiConnector('GET', `/comments/post/${postId}`);
    // console.log("comments response", response.data.data);
    return response.data.data;
  } catch (error) {
    throw new Error('Error fetching comments: ' + error.message);
  }
};

// Create a comment on a post
export const createPostComment = async (postId, commentData) => {
  try {
    const response = await apiConnector('POST', `/comments/post/${postId}`, commentData);
    console.log('comments post response ka data' , response.data)
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('Please login to comment');
    }
    throw new Error('Error creating comment: ' + error.message);
  }
};

// Get all tags (protected)
export const getAllTags = async () => {
  try {
    const response = await apiConnector('GET', '/tags');
    return response.data.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('Please login to view tags');
    }
    throw new Error('Error fetching tags: ' + error.message);
  }
};

// Add these new functions for comment operations
export const updateComment = async (commentId, content) => {
  try {
    const response = await apiConnector('PUT', `/comments/${commentId}`, { content });
    return response.data;
  } catch (error) {
    throw new Error('Error updating comment: ' + error.message);
  }
};

export const deleteComment = async (commentId) => {
  try {
    const response = await apiConnector('DELETE', `/comments/${commentId}`);
    return response.data;
  } catch (error) {
    throw new Error('Error deleting comment: ' + error.message);
  }
};