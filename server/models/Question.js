const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    asker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag'
    }],
    solutions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Solution'
    }],
    mediaUrls: [{
        url: String,
        type: {
            type: String,
            enum: ['image', 'video']
        }
    }],
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);
