const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim:true,
        //unique: true,
    },
    email: {
        type: String,
        required: true,
        trim:true
        //unique: true,
    },
    password: {
        type: String,
        required: true,
        trim:true,
    },
    profilePicture: {
        type: String,
        default: 'defaultProfilePic.jpg',
    },
    bio: {
        type: String,
        default: '',
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    resetPasswordToken: {
         type: String 
        },
    resetPasswordExpire: { 
        type: Date
    },
    resetOtp: {
        type: Number
    },
    resetOtpExpires: {
        type: Date
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    }],
    answers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Solution'
    }],
    reputation: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
