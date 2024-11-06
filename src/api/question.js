import { apiConnector } from './apiConnector';

// Create a New Question
export const createQuestion = async (questionData) => {
  try {
    const response = await apiConnector('POST', '/question', questionData);
    return response.data; // Returns the created question data
  } catch (error) {
    throw error; // Handle error accordingly
  }
};

// Fetch All Questions
export const fetchQuestions = async () => {
  try {
    const response = await apiConnector('GET', '/question');
    return response.data; // Returns a list of questions
  } catch (error) {
    throw error; // Handle error accordingly
  }
};

// Fetch a Single Question by ID
export const fetchQuestionById = async (questionId) => {
  try {
    const response = await apiConnector('GET', `/question/${questionId}`);
    return response.data; // Returns question details by ID
  } catch (error) {
    throw error; // Handle error accordingly
  }
};

// Update an Existing Question
export const updateQuestion = async (questionId, updatedData) => {
  try {
    const response = await apiConnector('PUT', `/question/${questionId}`, updatedData);
    return response.data; // Returns updated question data
  } catch (error) {
    throw error; // Handle error accordingly
  }
};

// Delete a Question
export const deleteQuestion = async (questionId) => {
  try {
    await apiConnector('DELETE', `/question/${questionId}`);
    return questionId; // Returns deleted question ID for confirmation
  } catch (error) {
    throw error; // Handle error accordingly
  }
};

// Exporting all question-related functions
export default {
  createQuestion,
  fetchQuestions,
  fetchQuestionById,
  updateQuestion,
  deleteQuestion,
};
