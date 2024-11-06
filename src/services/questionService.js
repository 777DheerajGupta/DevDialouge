import { apiConnector } from '../api/apiConnector';

// Get all questions
export const getAllQuestions = async () => {
  try {
    const response = await apiConnector('GET', '/questions');
    return response.data;
  } catch (error) {
    throw new Error('Error fetching questions: ' + error.message);
  }
};

// Get question by ID
export const getQuestionById = async (questionId) => {
  try {
    const response = await apiConnector('GET', `/questions/${questionId}`);
    // console.log(response)
    return response.data;
  } catch (error) {
    throw new Error('Error fetching question: ' + error.message);
  }
};

// Ask a new question
export const askQuestion = async (questionData) => {
  try {
    const response = await apiConnector('POST', '/questions', questionData , {
      headers: {
        'Authorization': `Bearer ${token}`, // If using token auth
        // Don't set Content-Type, let browser set it with boundary for FormData
      }
    });
    return response.data;
  } catch (error) {
    throw new Error('Error creating question: ' + error.message);
  }
};

// Update a question
export const updateQuestion = async (questionId, updateData) => {
  try {
    const response = await apiConnector('PUT', `/questions/${questionId}`, updateData);
    return response.data;
  } catch (error) {
    throw new Error('Error updating question: ' + error.message);
  }
};




// Delete a question
export const deleteQuestion = async (id) => {
  try {
    console.log('Attempting to delete question:', id);
    const response = await apiConnector('DELETE', `/questions/${id}`);
    
    if (response.status === 204 || response.status === 200) {
      return { success: true };
    }
    return response.data;
  } catch (error) {
    console.error('Delete error:', error);
    // Check if it's a server error (500)
    if (error.response?.status === 500) {
      throw new Error('Server error occurred while deleting question. Please try again later.');
    }
    throw new Error(error.response?.data?.message || 'Failed to delete question');
  }
};

// Answer a question
export const answerQuestion = async (questionId, answerData) => {
  try {
    const response = await apiConnector('POST', `/questions/${questionId}/answer`, answerData);
    return response.data;
  } catch (error) {
    throw new Error('Error submitting answer: ' + error.message);
  }
};

// Get answers for a question
export const getAnswersForQuestion = async (questionId ) => {
  try {
    const response = await apiConnector('GET', `/questions/${questionId}/answer` );
    // console.log('question  ka answer'  , response)
    return response.data;
  } catch (error) {
    throw new Error('Error fetching answers: ' + error.message);
  }
};

// Submit a solution
export const submitSolution = async (questionId, solutionData) => {
  try {
    const response = await apiConnector('POST', `/questions/${questionId}/answer`, solutionData);
    return response.data;
  } catch (error) {
    throw new Error('Error submitting solution: ' + error.message);
  }
};

// Add new service functions for answer operations
export const updateAnswer = async (answerId, content) => {
  try {
    const response = await apiConnector('PUT', `/solutions/${answerId}`, { content });
    return response.data;
  } catch (error) {
    throw new Error('Error updating answer: ' + error.message);
  }
};

export const deleteAnswer = async (answerId) => {
  try {
    const response = await apiConnector('DELETE', `/solutions/${answerId}`);
    return response.data;
  } catch (error) {
    throw new Error('Error deleting answer: ' + error.message);
  }
};