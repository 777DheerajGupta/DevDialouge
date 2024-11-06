const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
    createQuestion,
    getAllQuestions,
    getQuestionById,
    updateQuestion,
    deleteQuestion,
    getQuestionsByTag,
    getAnswersForQuestion,
    answerQuestion
} = require('../controllers/questionController');

// Get questions by tag - Move this route before /:id
router.get('/tag/:tagName', getQuestionsByTag);
router.get('/:id/answer',authMiddleware, getAnswersForQuestion);
router.post('/:id/answer', authMiddleware, answerQuestion);
// Other routes
router.post('/', authMiddleware, createQuestion);
router.get('/', getAllQuestions);
router.get('/:id', getQuestionById);
router.put('/:id', authMiddleware, updateQuestion);
router.delete('/:id', authMiddleware, deleteQuestion);

module.exports = router;
