const Comment = require('../models/Comment');
const Post = require('../models/Post');
const Question = require('../models/Question');

// Create a new comment on a post or question
// Create a new comment on a post or question
const createComment = async (req, res) => {
    try {
        const { content } = req.body;
        const { postId, questionId } = req.params;

        // Check if the postId or questionId exists in the request
        if (!postId && !questionId) {
            return res.status(400).json({ success: false, message: 'postId or questionId is required' });
        }

        let item, commentData;

        if (postId) {
            item = await Post.findById(postId);
            if (!item) {
                return res.status(404).json({ success: false, message: 'Post not found' });
            }
            // Comment data for a post
            commentData = {
                content,
                post: postId,
                author: req.user.id,
            };
        } else if (questionId) {
            item = await Question.findById(questionId);
            if (!item) {
                return res.status(404).json({ success: false, message: 'Question not found' });
            }
            // Comment data for a question
            commentData = {
                content,
                question: questionId,
                author: req.user.id,
            };
        }

        // Create the comment with the appropriate data
        const comment = await Comment.create(commentData);

        res.status(201).json({ success: true, data: comment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// Get all comments for a specific post
const getCommentsByPostId = async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.postId })
            .populate('author', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: comments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all comments for a specific question
const getCommentsByQuestionId = async (req, res) => {
    try {
        const comments = await Comment.find({ question: req.params.questionId })
            .populate('author', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: comments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update a comment
const updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const userId = req.user._id;

        // Find comment
        const comment = await Comment.findById(id);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found'
            });
        }

        // Check if user is the author of the comment
        if (comment.author.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this comment'
            });
        }

        // Update comment
        const updatedComment = await Comment.findByIdAndUpdate(
            id,
            { content },
            { 
                new: true,
                runValidators: true 
            }
        ).populate('author', 'name profilePicture');

        res.status(200).json({
            success: true,
            message: 'Comment updated successfully',
            data: updatedComment
        });

    } catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete a comment
const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        // Find comment
        const comment = await Comment.findById(id);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found'
            });
        }

        // Check if user is the author of the comment
        if (comment.author.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this comment'
            });
        }

        // Remove comment from post/question
        if (comment.post) {
            await Post.findByIdAndUpdate(
                comment.post,
                { $pull: { comments: id } }
            );
        } else if (comment.question) {
            await Question.findByIdAndUpdate(
                comment.question,
                { $pull: { comments: id } }
            );
        }

        // Delete the comment
        await Comment.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Comment deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createComment,
    getCommentsByPostId,
    getCommentsByQuestionId,
    updateComment,
    deleteComment,
};
