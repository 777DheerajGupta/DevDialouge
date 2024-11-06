import { createSlice } from '@reduxjs/toolkit';
import { apiConnector } from '../../api/apiConnector';

// Initial state
const initialState = {
  followRequests: [],
  loading: false,
  error: null,
};

// Slice
const followRequestSlice = createSlice({
  name: 'followRequests',
  initialState,
  reducers: {
    startLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setFollowRequests: (state, action) => {
      state.loading = false;
      state.followRequests = action.payload;
    },
    addFollowRequest: (state, action) => {
      state.loading = false;
      state.followRequests.push(action.payload);
    },
    acceptFollowRequest: (state, action) => {
      state.loading = false;
      state.followRequests = state.followRequests.filter(req => req.id !== action.payload);
    },
    rejectFollowRequest: (state, action) => {
      state.loading = false;
      state.followRequests = state.followRequests.filter(req => req.id !== action.payload);
    },
    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  startLoading,
  setFollowRequests,
  addFollowRequest,
  acceptFollowRequest,
  rejectFollowRequest,
  setError,
} = followRequestSlice.actions;

export default followRequestSlice.reducer;

// Action creators

// Fetch all follow requests for the current user
export const fetchFollowRequests = () => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await apiConnector('GET', '/follow-requests');
    dispatch(setFollowRequests(response.data));
  } catch (error) {
    dispatch(setError(error.response ? error.response.data.message : error.message));
  }
};

// Send a follow request to a user
export const sendFollowRequest = (userId) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await apiConnector('POST', '/follow-requests', { userId });
    dispatch(addFollowRequest(response.data));
  } catch (error) {
    dispatch(setError(error.response ? error.response.data.message : error.message));
  }
};

// Accept a follow request
export const acceptRequest = (requestId) => async (dispatch) => {
  dispatch(startLoading());
  try {
    await apiConnector('POST', `/follow-requests/${requestId}/accept`);
    dispatch(acceptFollowRequest(requestId));
  } catch (error) {
    dispatch(setError(error.response ? error.response.data.message : error.message));
  }
};

// Reject a follow request
export const rejectRequest = (requestId) => async (dispatch) => {
  dispatch(startLoading());
  try {
    await apiConnector('POST', `/follow-requests/${requestId}/reject`);
    dispatch(rejectFollowRequest(requestId));
  } catch (error) {
    dispatch(setError(error.response ? error.response.data.message : error.message));
  }
};
