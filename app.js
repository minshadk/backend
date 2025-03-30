const express = require('express')
const cors = require('cors')
const app = express()

// Middleware
app.use(express.json())
app.use(cors())

const userRoutes = require('./Routes/user')
const complaintsRoutes = require('./Routes/complaints')
const feedbackRoutes = require('./Routes/feedback')
const departmentRoutes = require('./Routes/department')

app.use('/user', userRoutes)
app.use('/complaints', complaintsRoutes)
app.use('/feedback', feedbackRoutes)
app.use('/departments', departmentRoutes)

module.exports = app
