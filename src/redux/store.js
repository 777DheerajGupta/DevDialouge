import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import postReducer from './slices/postSlice';
import questionReducer from './slices/questionSlice';
import commentReducer from './slices/commentSlice';
import chatReducer from './slices/chatSlice'
import notificationReducer from './slices/notificationSlice';
import followReducer from './slices/followRequestSlice';

// Configure the Redux store
const store = configureStore({
  reducer: {
    auth: authReducer,
    post: postReducer,
    question: questionReducer,
    comment: commentReducer,
    chat: chatReducer,
    notification: notificationReducer,
    follow: followReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Optional: disables warnings for non-serializable values in state (e.g., dates)
    }),
  devTools: process.env.NODE_ENV !== 'production', // Enables Redux DevTools in development
});

export default store;
