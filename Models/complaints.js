const mongoose = require('mongoose')

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    department: {
      type: String,
    },
    status: {
      type: String,
      // enum: ['pending', 'in progress', 'completed'],
      default: 'pending',
    },
    address: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    complaintImage: {
      url: { type: String },
      publicId: { type: String },
    },
    resolveImage: {
      url: { type: String },
      publicId: { type: String },
    },
    assignedWorker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
)

const Complaint = mongoose.model('Complaint', complaintSchema)
module.exports = Complaint
