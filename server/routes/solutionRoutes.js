const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
    createSolution,
    updateSolution,
    deleteSolution,
    getSolutionsByQuestionId,
    getUserSolutions
} = require('../controllers/solutionController');

// Create a new solution
router.post('/', authMiddleware, createSolution);

// Get all solutions for a specific question
router.get('/question/:questionId', getSolutionsByQuestionId);

// Get all solutions by a specific user
router.get('/user/:userId', getUserSolutions);

// Update a solution
router.put('/:id', authMiddleware, updateSolution);

// Delete a solution
router.delete('/:id', authMiddleware, deleteSolution);

module.exports = router;
