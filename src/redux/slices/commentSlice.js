import { createSlice } from '@reduxjs/toolkit';
import { apiConnector } from '../../api/apiConnector';

// Initial state
const initialState = {
  comments: [],
  loading: false,
  error: null,
};

// Slice
const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    startLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setComments: (state, action) => {
      state.loading = false;
      state.comments = action.payload;
    },
    addComment: (state, action) => {
      state.loading = false;
      state.comments.push(action.payload);
    },
    updateComment: (state, action) => {
      state.loading = false;
      const index = state.comments.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.comments[index] = action.payload;
      }
    },
    deleteComment: (state, action) => {
      state.loading = false;
      state.comments = state.comments.filter(c => c.id !== action.payload);
    },
    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  startLoading,
  setComments,
  addComment,
  updateComment,
  deleteComment,
  setError,
} = commentSlice.actions;

export default commentSlice.reducer;

// Action creators

// Fetch all comments for a specific post
export const fetchComments = (postId) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await apiConnector('GET', `/posts/${postId}/comments`);
    dispatch(setComments(response.data));
  } catch (error) {
    dispatch(setError(error.response ? error.response.data.message : error.message));
  }
};

// Create a new comment
export const createComment = (postId, commentData) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await apiConnector('POST', `/posts/${postId}/comments`, commentData);
    dispatch(addComment(response.data));
  } catch (error) {
    dispatch(setError(error.response ? error.response.data.message : error.message));
  }
};

// Update a comment
export const editComment = (commentId, updatedData) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await apiConnector('PUT', `/comments/${commentId}`, updatedData);
    dispatch(updateComment(response.data));
  } catch (error) {
    dispatch(setError(error.response ? error.response.data.message : error.message));
  }
};

// Delete a comment
export const removeComment = (commentId) => async (dispatch) => {
  dispatch(startLoading());
  try {
    await apiConnector('DELETE', `/comments/${commentId}`);
    dispatch(deleteComment(commentId));
  } catch (error) {
    dispatch(setError(error.response ? error.response.data.message : error.message));
  }
};
