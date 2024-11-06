const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    ratedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    raterUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    value: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
}, { timestamps: true });

module.exports = mongoose.model('Rating', ratingSchema);
