// Import the required modules
const express = require("express")
const router = express.Router()

// Import the required controllers and middleware functions
const {
  login,
  signup,
  sendotp,
  changePassword,
  verifyLoginOtp,
  sendLoginOtp,
} = require("../controllers/Auth")
const {
  resetPasswordSendOtp,
  resetPasswordOtpVerification,
  resetPassword,
} = require("../controllers/resetPassword")

const { auth } = require("../middleware/auth")

// Routes for Login, Signup, and Authentication

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

// Route for user login
router.post("/login", login)

// Route for user signup
router.post("/signup", signup)

// Route for sending OTP to the user's email
router.post("/sendotp", sendotp)

// Route for Changing the password
router.post("/changepassword", auth, changePassword)

//Route for sending Login Otp to user's email
router.post("/sendLoginOtp", sendLoginOtp)

//Route for Login Otp verification
router.post("/verify-login-otp", verifyLoginOtp)

// ********************************************************************************************************
//                                      Reset Password
// ********************************************************************************************************

// Route for generating a reset password email and sending Otp for verification
router.post("/reset-password-email", resetPasswordSendOtp)

//Route for Otp Verification for reseting the Password
router.post("/reset-password-otp-verification", resetPasswordOtpVerification)

// Route for resetting user's password after verification
router.post("/reset-password", resetPassword)

// Export the router for use in the main application
module.exports = router
