const Solution = require('../models/Solution');
const Question = require('../models/Question');
const User = require('../models/User');

// Create a new solution for a question
const createSolution = async (req, res) => {
    try {
        const { content, questionId } = req.body;
        const userId = req.user._id;

        console.log('Creating solution with:', { content, questionId, userId });

        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({ success: false, message: 'Question not found' });
        }

        const solution = await Solution.create({
            content,
            solver: userId,
            question: questionId
        });

        console.log('Created solution:', solution);

        const updatedQuestion = await Question.findByIdAndUpdate(
            questionId,
            { $push: { solutions: solution._id } },
            { new: true }
        );

        await User.findByIdAndUpdate(
            userId,
            { $push: { answers: solution._id } }
        );

        res.status(201).json({
            success: true,
            data: solution
        });
    } catch (error) {
        console.error('Error creating solution:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all solutions for a specific question
const getSolutionsByQuestionId = async (req, res) => {
    try {
        const solutions = await Solution.find({ question: req.params.questionId })
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: solutions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update a solution
const updateSolution = async (req, res) => {
    try {
        const { content } = req.body;

        const solution = await Solution.findByIdAndUpdate(
            req.params.id,
            { content },
            { new: true, runValidators: true }
        );

        if (!solution) {
            return res.status(404).json({ success: false, message: 'Solution not found' });
        }

        res.status(200).json({ success: true, data: solution });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a solution
const deleteSolution = async (req, res) => {
    try {
        const solution = await Solution.findByIdAndDelete(req.params.id);

        if (!solution) {
            return res.status(404).json({ success: false, message: 'Solution not found' });
        }

        res.status(200).json({ success: true, message: 'Solution deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all solutions for a specific user
const getUserSolutions = async (req, res) => {
    try {
        const solutions = await Solution.find({ solver: req.params.userId })
            .populate('question', 'title')
            .populate('solver', 'name profilePicture')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: solutions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createSolution,
    getSolutionsByQuestionId,
    updateSolution,
    deleteSolution,
    getUserSolutions,
};
