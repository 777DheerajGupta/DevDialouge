// chatSlice.js
import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: [],
    currentChat: null,
    loading: false,
    error: null,
  },
  reducers: {
    // Action to set loading state
    setLoading(state, action) {
      state.loading = action.payload;
    },
    // Action to add a new message to the chat
    addMessage(state, action) {
      state.messages.push(action.payload);
    },
    // Action to set the current chat (if using a one-on-one chat)
    setCurrentChat(state, action) {
      state.currentChat = action.payload;
    },
    // Action to clear messages (for example, when leaving a chat)
    clearMessages(state) {
      state.messages = [];
    },
    // Action to set an error (if needed)
    setError(state, action) {
      state.error = action.payload;
    },
    // Action to reset error
    resetError(state) {
      state.error = null;
    },
  },
});

// Export actions
export const {
  setLoading,
  addMessage,
  setCurrentChat,
  clearMessages,
  setError,
  resetError,
} = chatSlice.actions;

// Thunk for sending a message (not using createAsyncThunk)
export const sendMessage = (messageData) => {
  return (dispatch) => {
    dispatch(setLoading(true));

    // Simulating an API call (replace with actual API call)
    setTimeout(() => {
      dispatch(addMessage(messageData)); // Add message to the store
      dispatch(setLoading(false)); // Set loading to false
    }, 1000);
  };
};

// Thunk for receiving a message (not using createAsyncThunk)
export const receiveMessage = (messageData) => {
  return (dispatch) => {
    // Immediately add the received message to the store
    dispatch(addMessage(messageData));
  };
};

// Export the reducer
export default chatSlice.reducer;

