import { createSlice } from '@reduxjs/toolkit';
import { apiConnector } from '../../api/apiConnector';

// Initial state
const initialState = {
  questions: [],
  loading: false,
  error: null,
};

// Slice
const questionSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    startLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setQuestions: (state, action) => {
      state.loading = false;
      state.questions = action.payload;
    },
    addQuestion: (state, action) => {
      state.loading = false;
      state.questions.push(action.payload);
    },
    updateQuestion: (state, action) => {
      state.loading = false;
      const index = state.questions.findIndex(q => q.id === action.payload.id);
      if (index !== -1) {
        state.questions[index] = action.payload;
      }
    },
    deleteQuestion: (state, action) => {
      state.loading = false;
      state.questions = state.questions.filter(q => q.id !== action.payload);
    },
    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  startLoading,
  setQuestions,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  setError,
} = questionSlice.actions;

export default questionSlice.reducer;

// Action creators

// Fetch all questions
export const fetchQuestions = () => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await apiConnector('GET', '/questions');
    dispatch(setQuestions(response.data));
  } catch (error) {
    dispatch(setError(error.response ? error.response.data.message : error.message));
  }
};

// Create a new question
export const createQuestion = (questionData) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await apiConnector('POST', '/questions', questionData);
    dispatch(addQuestion(response.data));
  } catch (error) {
    dispatch(setError(error.response ? error.response.data.message : error.message));
  }
};

// Update a question
export const editQuestion = (questionId, updatedData) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await apiConnector('PUT', `/questions/${questionId}`, updatedData);
    dispatch(updateQuestion(response.data));
  } catch (error) {
    dispatch(setError(error.response ? error.response.data.message : error.message));
  }
};

// Delete a question
export const removeQuestion = (questionId) => async (dispatch) => {
  dispatch(startLoading());
  try {
    await apiConnector('DELETE', `/questions/${questionId}`);
    dispatch(deleteQuestion(questionId));
  } catch (error) {
    dispatch(setError(error.response ? error.response.data.message : error.message));
  }
};
