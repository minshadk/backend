const FeedBack = require('../Models/feedback')
const Complaint = require('../Models/complaints')

exports.createFeedBack = async (req, res) => {
  try {
    const {
      title,
      description,
      complaintId,
      user,
      satisfactionLevel,
    } = req.body

    // Check if complaint exists
    const complaint = await Complaint.findById(complaintId)
    if (!complaint) {
      return res.status(400).json({ message: 'Complaint not found' })
    }

    // Create feedback
    const feedback = new FeedBack({
      title,
      description,
      complaintId,
      user,
      satisfactionLevel,
    })
    await feedback.save()

    res.status(201).json({ message: 'Feedback created successfully', feedback })
  } catch (error) {
    console.error(error)
    res.status(400).json({ message: error.message })
  }
}

exports.getFeedBacks = async (req, res) => {
  try {
    const feedbacks = await FeedBack.find()
      .populate('user', 'userName') // Populate user with selected fields
      .populate('complaintId', 'title description') // Populate complaint with selected fields
    res.status(200).json({ feedbacks })
  } catch (error) {
    console.error(error)
    res.status(400).json({ message: error.message })
  }
}

exports.getFeedBack = async (req, res) => {
  try {
    const feedback = await FeedBack.findById(req.params.id)
      .populate('user', 'userName')
      .populate('complaintId', 'title description')
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' })
    }
    res.status(200).json({ feedback })
  } catch (error) {
    console.error(error)
    res.status(400).json({ message: error.message })
  }
}

exports.updateFeedBack = async (req, res) => {
  try {
    const feedback = await FeedBack.findById(req.params.id)
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' })
    }
    const updatedFeedback = await FeedBack.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    )
    res
      .status(200)
      .json({ message: 'Feedback updated successfully', updatedFeedback })
  } catch (error) {
    console.error(error)
    res.status(400).json({ message: error.message })
  }
}

exports.deleteFeedBack = async (req, res) => {
  try {
    const feedback = await FeedBack.findById(req.params.id)
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' })
    }
    await FeedBack.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: 'Feedback deleted successfully' })
  } catch (error) {
    console.error(error)
    res.status(400).json({ message: error.message })
  }
}

exports.getUserFeedbacksByUser = async (req, res) => {
  try {
    const { userId } = req.params // Assuming userId is in the URL

    const feedbacks = await FeedBack.find({ user: userId })
      .populate('complaintId', 'title') // Populate complaint details
      .populate('user', 'name email') // Populate user details
      .sort({ createdAt: -1 }) // Sort by latest feedback

    if (!feedbacks.length) {
      return res
        .status(404)
        .json({ message: 'No feedback found for this user.' })
    }

    res.status(200).json({ feedbacks })
  } catch (error) {
    console.error('Error fetching user feedback:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

exports.getWorkerFeedbacks = async (req, res) => {
  try {
    const { workerId } = req.params
    console.log('Worker ID:', workerId)

    if (!workerId || workerId === 'undefined') {
      return res.status(400).json({
        status: 'failed',
        message: 'Worker ID is required and must be valid',
      })
    }

    console.log('Worker ID received:', workerId) // Debugging log

    // Ensure workerId is a valid MongoDB ObjectId
    if (!workerId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        status: 'failed',
        message: 'Invalid Worker ID format',
      })
    }

    // Find complaints assigned to the worker
    const complaints = await Complaint.find({
      assignedWorker: workerId,
    }).select('_id')

    if (!complaints.length) {
      return res.status(404).json({
        status: 'failed',
        message: 'No feedback found for complaints assigned to this worker',
      })
    }

    const complaintIds = complaints.map((complaint) => complaint._id)

    // Fetch feedback related to those complaints
    const feedbacks = await FeedBack.find({
      complaintId: { $in: complaintIds },
    })
      .populate('user', 'name phoneNumber')
      .populate('complaintId', 'title')

    return res.status(200).json({
      status: 'success',
      totalFeedbacks: feedbacks.length,
      feedbacks,
    })
  } catch (error) {
    console.error('Error fetching worker feedback:', error)
    return res.status(500).json({
      status: 'failed',
      message: 'Internal server error',
    })
  }
}
