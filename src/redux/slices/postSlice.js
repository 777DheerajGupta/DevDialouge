import { createSlice } from '@reduxjs/toolkit';
import { apiConnector } from '../../api/apiConnector';

// Initial state
const initialState = {
  posts: [],
  loading: false,
  error: null,
};

// Slice
const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // Start loading
    startLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    // Set fetched posts
    setPosts: (state, action) => {
      state.loading = false;
      state.posts = action.payload;
    },
    // Set a new post
    addPost: (state, action) => {
      state.loading = false;
      state.posts.push(action.payload);
    },
    // Handle errors
    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { startLoading, setPosts, addPost, setError } = postSlice.actions;

export default postSlice.reducer;

// Action creators

export const fetchPosts = () => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await apiConnector('GET', '/posts');
    dispatch(setPosts(response.data));
  } catch (error) {
    dispatch(setError(error.response ? error.response.data.message : error.message));
  }
};

export const createPost = (postData) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await apiConnector('POST', '/posts', postData);
    dispatch(addPost(response.data));
  } catch (error) {
    dispatch(setError(error.response ? error.response.data.message : error.message));
  }
};
