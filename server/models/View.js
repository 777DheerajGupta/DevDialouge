const mongoose = require('mongoose');

const viewSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  ipAddress: String,
  viewedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to prevent duplicate views from same user/IP
viewSchema.index({ questionId: 1, userId: 1, ipAddress: 1 }, { unique: true });

module.exports = mongoose.model('View', viewSchema);