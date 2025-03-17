const multer = require('multer')
const cloudinary = require('../utils/cloudinary')

const Complaint = require('../Models/complaints')
const User = require('../Models/user')

// Configure multer to store file in memory
const storage = multer.memoryStorage()
const upload = multer({ storage })

exports.createComplaint = async (req, res) => {
  try {
    const { title, description, userId, address,department } = req.body
    let imageUrl = null
    let imagePublicId = null
    if (req.file) {
      // Upload image to Cloudinary
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'complaints' },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          },
        )
        stream.end(req.file.buffer)
      })

      imageUrl = result.secure_url
      imagePublicId = result.public_id
    }

    const complaint = new Complaint({
      title,
      description,
      userId,
      address,
      department,
      complaintImage: imageUrl
        ? { publicId: imagePublicId, url: imageUrl }
        : null,
    })

    await complaint.save()
    res
      .status(201)
      .json({ message: 'Complaint created successfully', complaint })
  } catch (error) {
    console.error('Error:', error)
    res.status(400).json({ message: error.message })
  }
}

exports.getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('userId')
      .populate('assignedWorker')
    res.status(200).json({ complaints })
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: error.message })
  }
}

exports.getComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('userId')
      .populate('assignedWorker')
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' })
    }
    res.status(200).json({ complaint })
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: error.message })
  }
}

exports.getComplaintsByUser = async (req, res) => {
  try {
    const { userId } = req.params
    console.log('User ID:', userId)

    const complaints = await Complaint.find({ userId: userId })
      .populate('userId')
      .populate('assignedWorker')

    if (!complaints.length) {
      return res
        .status(404)
        .json({ message: 'No complaints found for this user' })
    }

    res.status(200).json({ complaints })
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: error.message })
  }
}

exports.updateComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
    console.log(req.body)
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' })
    }
    if (req.body.assignedWorker) {
      const worker = await User.findById(req.body.assignedWorker)
      if (!worker) {
        return res.status(400).json({ message: 'Worker not found' })
      }
    }
    await Complaint.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.status(200).json({ message: 'Complaint updated successfully' })
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: error.message })
  }
}

exports.getAssignedWorks = async (req, res) => {
  try {
    const { workerId } = req.params
    console.log('Worker ID:', workerId)

    const complaints = await Complaint.find({ assignedWorker: workerId })
      .populate('userId')
      .populate('assignedWorker')

    // if (!complaints.length) {
    //   return res
    //     .status(404)
    //     .json({ message: 'You dont have any work assigned' })
    // }

    res.status(200).json({ complaints })
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: error.message })
  }
}

exports.deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' })
    }
    await Complaint.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: 'Complaint deleted successfully' })
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: error.message })
  }
}

exports.uploadResolveImage = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
    console.log(req.body)
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' })
    }
    if (req.file) {
      // Upload image to Cloudinary
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'complaints' },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          },
        )
        stream.end(req.file.buffer)
      })

      const imageUrl = result.secure_url
      const imagePublicId = result.public_id

      await Complaint.findByIdAndUpdate(req.params.id, {
        resolveImage: { publicId: imagePublicId, url: imageUrl },
        status: 'completed',
      })

      return res.status(200).json({ message: 'Image uploaded successfully' })
    }
    res.status(200).json({ message: 'Complaint updated successfully' })
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: error.message })
  }
}
