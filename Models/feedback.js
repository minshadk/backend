const mongoose = require('mongoose')

const feedbackSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  satisfactionLevel: { type: String },
  complaintId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Complaint',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
})

const FeedBack = mongoose.model('FeedBack', feedbackSchema)
module.exports = FeedBack
