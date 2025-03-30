const express = require('express')
const router = express.Router()

const user = require('../Controllers/user')

router.post('/signup', user.createUser)
router.post('/login', user.logIn)

router.get('/workers', user.getAllWorkers)
router.get('/users', user.getAllUsers)
router.delete('/user/:id', user.deleteUser)

module.exports = router
 