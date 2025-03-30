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
    latitude: {
      type: Number, // To store the latitude
      required: true, // Make it required if needed
    },
    longitude: {
      type: Number, // To store the longitude
      required: true, // Make it required if needed
    },
  },
  { timestamps: true },
)

const Complaint = mongoose.model('Complaint', complaintSchema)
module.exports = Complaint
