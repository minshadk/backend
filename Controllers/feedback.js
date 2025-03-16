const FeedBack = require('../Models/feedback');
const Complaint = require('../Models/complaints'); 

exports.createFeedBack = async (req, res) => {
  try {
    const { title, description, complaintId, user } = req.body;

    // Check if complaint exists
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(400).json({ message: 'Complaint not found' });
    }

    // Create feedback
    const feedback = new FeedBack({ title, description, complaintId, user });
    await feedback.save();

    res.status(201).json({ message: 'Feedback created successfully', feedback });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

exports.getFeedBacks = async (req, res) => {
  try {
    const feedbacks = await FeedBack.find()
      .populate('user', 'userName') // Populate user with selected fields
      .populate('complaintId', 'title description'); // Populate complaint with selected fields
    res.status(200).json({ feedbacks });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

exports.getFeedBack = async (req, res) => {
  try {
    const feedback = await FeedBack.findById(req.params.id)
      .populate('user', 'userName')
      .populate('complaintId', 'title description');
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    res.status(200).json({ feedback });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

exports.updateFeedBack = async (req, res) => {
  try {
    const feedback = await FeedBack.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    const updatedFeedback = await FeedBack.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ message: 'Feedback updated successfully', updatedFeedback });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

exports.deleteFeedBack = async (req, res) => {
  try {
    const feedback = await FeedBack.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    await FeedBack.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};
