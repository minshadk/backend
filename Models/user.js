const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    }, 
    phoneNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      enum: ['admin', 'worker', 'user'],
      required: true,
      default: 'user',
    },
    department: {
      type: String,    },
  },
  { timestamps: true },
)

const User = mongoose.model('User', userSchema)
module.exports = User
