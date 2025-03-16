const express = require('express')
const router = express.Router()
const multer = require('multer')

const storage = multer.memoryStorage()
const upload = multer({ storage })

const complaints = require('../Controllers/complaints')

// router.post('/create', complaints.createComplaint);
router.post('/create', upload.single('image'), complaints.createComplaint)
router.get('/', complaints.getComplaints)
router.get('/:id', complaints.getComplaint)
router.get('/assigned/:workerId', complaints.getAssignedWorks)
router.patch('/:id', complaints.updateComplaint)
router.patch(
  '/resolve-image/:id',
  upload.single('image'),
  complaints.uploadResolveImage,
)
router.get('/byUserId/:userId', complaints.getComplaintsByUser)

module.exports = router
