import { createSlice } from '@reduxjs/toolkit';
import { apiConnector } from '../../api/apiConnector';

// Initial state
const initialState = {
  notifications: [],
  loading: false,
  error: null,
};

// Slice
const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    startLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setNotifications: (state, action) => {
      state.loading = false;
      state.notifications = action.payload;
    },
    markAsRead: (state, action) => {
      state.loading = false;
      const notificationIndex = state.notifications.findIndex((notification) => notification.id === action.payload);
      if (notificationIndex !== -1) {
        state.notifications[notificationIndex].read = true; // Assuming the notification has a 'read' property
      }
    },
    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  startLoading,
  setNotifications,
  markAsRead,
  setError,
} = notificationSlice.actions;

export default notificationSlice.reducer;

// Action creators

// Fetch all notifications for the current user
export const fetchNotifications = () => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await apiConnector('GET', '/notifications');
    dispatch(setNotifications(response.data));
  } catch (error) {
    dispatch(setError(error.response ? error.response.data.message : error.message));
  }
};

// Mark a notification as read
export const markNotificationAsRead = (notificationId) => async (dispatch) => {
  dispatch(startLoading());
  try {
    await apiConnector('POST', `/notifications/${notificationId}/mark-as-read`);
    dispatch(markAsRead(notificationId));
  } catch (error) {
    dispatch(setError(error.response ? error.response.data.message : error.message));
  }
};
