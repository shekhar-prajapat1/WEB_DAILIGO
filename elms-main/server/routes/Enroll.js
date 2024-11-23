// Import the required modules
const express = require("express")
const router = express.Router()
const {
  enrollStudents,
} = require("../controllers/enroll")

const { auth, isStudent } = require("../middleware/auth")
router.post("/enrollStudents", auth, isStudent,  enrollStudents)


module.exports = router
