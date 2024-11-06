import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: !!localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,
    resetPasswordMessage: null,
  },
  reducers: {
    loginSuccess(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('userId', action.payload.user.id);
    },
    
    loginFailure(state, action) {
      state.isAuthenticated = false;
      state.error = action.payload;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    resetPasswordSuccess(state, action) {
      state.resetPasswordMessage = action.payload;
      state.error = null;
    },
    resetPasswordFailure(state, action) {
      state.resetPasswordMessage = null;
      state.error = action.payload;
    },
  },
});

export const {
  loginSuccess,
  loginFailure,
  logout,
  setLoading,
  resetPasswordSuccess,
  resetPasswordFailure,
} = authSlice.actions;

export default authSlice.reducer;
