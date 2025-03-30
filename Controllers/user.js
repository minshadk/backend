const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../Models/user')
const Complaint = require('../Models/complaints')
const Feedback = require('../Models/feedback')

const mongoose = require('mongoose')

exports.createUser = async (req, res) => {
  try {
    const { password } = req.body

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = new User({ ...req.body, password: hashedPassword })

    await user.save()
    res.status(201).json({ message: 'User created successfully', user })
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: error.message })
  }
}

exports.logIn = async (req, res) => {
  const { userName, password } = req.body

  console.log(req.body)
  try {
    const user = await User.findOne({ userName })

    if (!user) {
      return res
        .status(400)
        .json({ status: 'failed', message: 'Invalid credentials' })
    }

    // Compare entered password with hashed password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res
        .status(400)
        .json({ status: 'failed', message: 'Invalid credentials' })
    }

    const createToken = (_id) => {
      return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' })
    }

    const token = createToken(user._id)

    console.log(user)

    res.status(200).json({
      message: 'Login successful',
      status: 'success',
      data: {
        userData: {
          token,
          userName: user.userName,
          userType: user.userType,
          userId: user._id,
          department: user.department || null, // Include department if it exists
        },
      },
    })
  } catch (err) {
    console.log(err)
    res.status(400).json({ status: 'failed', message: 'Login failed' })
  }
}

exports.getAllWorkers = async (req, res) => {
  try {
    const workers = await User.find({ userType: 'worker' })
    res.status(200).json({ success: true, workers })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error })
  }
}

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ userType: 'user' })
    res.status(200).json({ success: true, users })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error })
  }
}

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params

    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    if (user.userType === 'worker') {
      const complaints = await Complaint.find({ assignedWorker: id })

      const complaintIds = complaints.map((c) => c._id)

      await Feedback.deleteMany({ complaintId: { $in: complaintIds } })

      await Complaint.deleteMany({ assignedWorker: id })
    } else {
      await Complaint.deleteMany({ userId: id })
      await Feedback.deleteMany({ user: id })
    }

    await User.findByIdAndDelete(id)

    res.status(200).json({
      success: true,
      message:
        'User and all related data (complaints and feedback) deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting user:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while deleting user',
      error: error.message,
    })
  }
}

// exports.deleteUser = async (req, res) => {
//   try {
//     const { id } = req.params

//     // Find the user first
//     const user = await User.findById(id)
//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found' })
//     }

//     // Delete related complaints and feedback
//     if (user.role === 'worker') {
//       await Complaint.deleteMany({ assignedWorker: id })
//     } else {
//       await Complaint.deleteMany({ userId: id })
//       await Feedback.deleteMany({ user: id })
//     }

//     // Delete the user
//     await User.findByIdAndDelete(id)

//     res
//       .status(200)
//       .json({
//         success: true,
//         message: 'User and related data deleted successfully',
//       })
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Server error', error })
//   }
// }
