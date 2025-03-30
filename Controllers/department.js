const Department = require('../Models/department')

exports.createDepartment = async (req, res) => {
  try {

    console.log(req.body)   
    const user = new Department({ ...req.body })

    await user.save()
    res.status(201).json({ message: 'User created successfully', user })
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: error.message })
  }
} 

exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find()
    res.status(200).json({ departments })
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: error.message })
  }
}
