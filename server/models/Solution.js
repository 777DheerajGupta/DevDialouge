const mongoose = require('mongoose');

const solutionSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true
  },
  solver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Solution', solutionSchema);