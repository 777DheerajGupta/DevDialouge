const Tag = require('../models/Tag');

// Create a new tag
const createTag = async (req, res) => {
    try {
        const { name } = req.body;

        const tag = new Tag({ name });
        await tag.save();
        
        res.status(201).json({ success: true, data: tag });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all tags
const getAllTags = async (req, res) => {
    try {
        const tags = await Tag.find();
        res.status(200).json({ success: true, data: tags });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get a single tag by ID
const getTagById = async (req, res) => {
    try {
        const tag = await Tag.findById(req.params.tagId);

        if (!tag) {
            return res.status(404).json({ success: false, message: 'Tag not found' });
        }

        res.status(200).json({ success: true, data: tag });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update a tag
const updateTag = async (req, res) => {
    try {
        const { name } = req.body;

        const tag = await Tag.findById(req.params.tagId);
        if (!tag) {
            return res.status(404).json({ success: false, message: 'Tag not found' });
        }

        tag.name = name || tag.name;
        await tag.save();

        res.status(200).json({ success: true, data: tag });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a tag
const deleteTag = async (req, res) => {
    try {
        const tag = await Tag.findById(req.params.tagId);
        if (!tag) {
            return res.status(404).json({ success: false, message: 'Tag not found' });
        }

        await tag.deleteOne();
        res.status(200).json({ success: true, message: 'Tag deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createTag,
    getAllTags,
    getTagById,
    updateTag,
    deleteTag,
};
