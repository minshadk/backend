const express = require('express')
const router = express.Router()

const feedback = require('../Controllers/feedback')

router.post('/create', feedback.createFeedBack)
router.get('/', feedback.getFeedBacks)
router.get('/:id', feedback.getFeedBack)
router.get('/byUser/:userId', feedback.getUserFeedbacksByUser)
router.get('/byworker/:workerId', feedback.getWorkerFeedbacks)
router.patch('/:id', feedback.updateFeedBack)
router.delete('/:id', feedback.deleteFeedBack)

module.exports = router
