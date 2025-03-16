const express = require('express')
const router = express.Router()

const user = require('../Controllers/user')

router.post('/signup', user.createUser)
router.post('/login', user.logIn)

router.get('/workers', user.getAllWorkers)
router.delete('/workers/:id', user.deleteWorker)

module.exports = router
 