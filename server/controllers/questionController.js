const Question = require('../models/Question');
const Tag = require('../models/Tag');
const Solution = require('../models/Solution');
const cloudinary = require('cloudinary').v2;
const User = require('../models/User');

// Create a new question
const createQuestion = async (req, res) => {
    try {
        const { title, content, tags } = req.body;
        const files = req.files;
        const userId = req.user._id;

        // Validate required fields
        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: 'Title and content are required'
            });
        }

        // Handle tags
        let tagIds = [];
        if (tags) {
            const tagsArray = Array.isArray(tags) ? tags : JSON.parse(tags);
            tagIds = await Promise.all(tagsArray.map(async (tagName) => {
                let tag = await Tag.findOne({ name: tagName });
                if (!tag) {
                    tag = await Tag.create({ name: tagName });
                }
                return tag._id;
            }));
        }

        // Initialize question data
        const questionData = {
            title,
            content,
            asker: userId,
            tags: tagIds,
            contentType:'text',
        };

        // Handle media uploads
        if (files && files.media) {
            const mediaFiles = Array.isArray(files.media) ? files.media : [files.media];
            const mediaUrls = [];
            
            for (const file of mediaFiles) {
                const isVideo = file.mimetype.startsWith('video/');
                
                const result = await cloudinary.uploader.upload(file.tempFilePath, {
                    resource_type: isVideo ? 'video' : 'image',
                    folder: 'questions'
                });

                // Add media URL to content
                mediaUrls.push({
                    url: result.secure_url,
                    type: isVideo ? 'video' : 'image'
                });
            }
            questionData.mediaUrls = mediaUrls;
            questionData.contentType = mediaUrls[0].type;
        }

        const question = await Question.create(questionData);
        await User.findByIdAndUpdate(userId, { $push: { questions: question._id } });   

        const populatedQuestion = await Question.findById(question._id)
            .populate('asker', 'name profilePicture')
            .populate('tags', 'name')
            .populate({
                path: 'solutions',
                populate: { path: 'solver', select: 'name profilePicture' }
            });

        res.status(201).json({
            success: true,
            data: populatedQuestion
        });

    } catch (error) {
        console.error('Error creating question:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Ask a question (same as createQuestion)
const askQuestion = createQuestion;

// Get all questions
const getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.find()
            .populate('asker', 'name email')
            .populate('tags')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: questions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get a question by ID
const getQuestionById = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id)
            .populate({
                path: 'solutions',
                populate: {
                    path: 'solver',
                    select: 'name profilePicture'
                }
            })
            .populate('asker', 'name profilePicture')
            .populate('tags');

        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }

        res.status(200).json({
            success: true,
            data: question
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update a question
const updateQuestion = async (req, res) => {
    try {
        const { title, content, tags } = req.body;
        const files = req.files;
        const userId = req.user._id;
        const questionId = req.params.id;

        const question = await Question.findOne({ _id: questionId, asker: userId });
        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found or unauthorized'
            });
        }

        if (title) question.title = title;
        if (content) question.content = content;

        if (tags) {
            const tagsArray = Array.isArray(tags) ? tags : JSON.parse(tags);
            const tagIds = await Promise.all(tagsArray.map(async (tagName) => {
                let tag = await Tag.findOne({ name: tagName });
                if (!tag) {
                    tag = await Tag.create({ name: tagName });
                }
                return tag._id;
            }));
            question.tags = tagIds;
        }

        if (files && files.media) {
            const mediaFiles = Array.isArray(files.media) ? files.media : [files.media];
            const mediaUrls= [];

            
            for (const file of mediaFiles) {
                const isVideo = file.mimetype.startsWith('video/');
                
                const result = await cloudinary.uploader.upload(file.tempFilePath, {
                    resource_type: isVideo ? 'video' : 'image',
                    folder: 'questions'
                });

                // Add media URL to content
                    mediaUrls.push({
                    url: result.secure_url,
                    type: isVideo ? 'video' : 'image'
                });
            }
            question.mediaUrls = mediaUrls;
            question.contentType = mediaUrls[0].type;   
        }

        await question.save();

        const updatedQuestion = await Question.findById(questionId)
            .populate('asker', 'name profilePicture')
            .populate('tags', 'name')
            .populate({
                path: 'solutions',
                populate: { path: 'solver', select: 'name profilePicture' }
            });

        res.status(200).json({
            success: true,
            data: updatedQuestion
        });

    } catch (error) {
        console.error('Error updating question:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete a question
const deleteQuestion = async (req, res) => {
    try {
        const question = await Question.findOneAndDelete({
            _id: req.params.id,
            asker: req.user._id
        });

        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found or unauthorized'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Question deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Answer a question
const answerQuestion = async (req, res) => {
    try {
        const { content } = req.body;
        const questionId = req.params.id;
        const userId = req.user._id;  // From auth middleware

        // Validate input
        if (!content) {
            return res.status(400).json({
                success: false,
                message: 'Answer content is required'
            });
        }

        // Create the solution
        const solution = await Solution.create({
            content,
            question: questionId,
            solver: userId,  // Changed from author to solver
        });

        // Add solution to question's solutions array
        await Question.findByIdAndUpdate(
            questionId,
            { $push: { solutions: solution._id } }
        );

        // Populate the solution with solver details
        const populatedSolution = await Solution.findById(solution._id)
            .populate('solver', 'name profilePicture');

        res.status(201).json({
            success: true,
            data: populatedSolution
        });

    } catch (error) {
        console.error('Error answering question:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get answers for a specific question
const getAnswersForQuestion = async (req, res) => {
    try {
        const { id } = req.params;

        const question = await Question.findById(id)
            .populate({
                path: 'solutions',
                populate: [
                    {
                        path: 'solver',
                        select: 'name profilePicture'
                    },
                    {
                        path: 'comments',
                        populate: {
                            path: 'author',
                            select: 'name profilePicture'
                        }
                    }
                ],
                options: { sort: { createdAt: -1 } }
            });

        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }

        res.status(200).json({
            success: true,
            data: question.solutions || [],
            count: question.solutions?.length || 0
        });

    } catch (error) {
        console.error('Error fetching answers:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching answers',
            error: error.message
        });
    }
};

// Get questions by tag
const getQuestionsByTag = async (req, res) => {
    try {
        const { tagName } = req.params;

        // First find the tag by name
        const tag = await Tag.findOne({ name: tagName });
        
        if (!tag) {
            return res.status(404).json({
                success: false,
                message: `No tag found with name: ${tagName}`
            });
        }

        // Find questions that have this tag ID
        const questions = await Question.find({ tags: tag._id })
            .populate('asker', 'name profilePicture')
            .populate('tags', 'name')
            .populate({
                path: 'solutions',
                populate: {
                    path: 'solver',
                    select: 'name profilePicture'
                }
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: questions,
            count: questions.length
        });

    } catch (error) {
        console.error('Error fetching questions by tag:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching questions by tag',
            error: error.message
        });
    }
};

module.exports = {
    createQuestion,
    getAllQuestions,
    getQuestionById,
    updateQuestion,
    deleteQuestion,
    answerQuestion,
    getAnswersForQuestion,
    getQuestionsByTag
};
