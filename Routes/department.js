const express = require('express')
const router = express.Router()

const department = require('../Controllers/department')

router.post('/create', department.createDepartment)
router.get('/', department.getAllDepartments)

module.exports = router
