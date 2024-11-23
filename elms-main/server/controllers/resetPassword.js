const User = require("../models/User")
const mailSender = require("../utils/mailSender")
const otpGenerator = require("otp-generator")
const ResetPassword = require('../models/ResetPassword')
const bcrypt = require("bcrypt")

exports.resetPasswordSendOtp = async (req, res) => {
  try {
    const email = req.body.email
    const user = await User.findOne({ email: email })

    if (!user) {
      return res.status(400).json({
        success: false,
        message: `This Email: ${email} is not Registered With Us Enter a Valid Email `,
      })
    }

    const otp = otpGenerator.generate(6,{
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    })

    const otpPayload = { email, otp }
    await ResetPassword.create(otpPayload)

    res.status(200).json({
      success: true,
      message:
        "Email Sent Successfully, Please Check Your Email to Continue Further",
    })
  } catch (error) {
    return res.status(400).json({
      error: error.message,
      success: false,
      message: `Some Error in Sending the Reset Message`,
    })
  }
}

exports.resetPasswordOtpVerification = async (req, res) => {
   
  const email = req.body.email
  const otp = req.body.otp

  try {
    
    const response = await ResetPassword.findOne({
       email: email,
       otp: otp
    })

    if(response === null)
      return res.status(400).json({
        success: false,
        message: 'Invalid Otp'
      })

    return res.status(200).json({
       success: true,
       message: 'Otp Verified'
    })

  } catch (error) {
    
    res.status(400).json({
       success: false,
       message: error.message
    })

  }

}

exports.resetPassword = async (req, res) => {
        
  const email = req.body.email
  const password = req.body.password
  const confirmPassword = req.body.confirmPassword

  if(password !== confirmPassword){
     return res.status(400).json({
       success: false,
       message: 'Password must be same'
     })
  }

  try {
    
      const newPassword = await bcrypt.hash(password, 10)
      
      const response = await User.findOneAndUpdate({
        email: email
      },

      {
        password: newPassword
      },

      {
        new: true
      })

    
      console.log(response)

      await mailSender(email, "Password Reset Successfully", "Password Reset Successfull")

      return res.status(200).json({
        success: true,
        message: 'Password Reset Successfully'
      })

  } catch (error) {
    
      return res.status(400).json({
        success: false,
        message: error.message
      })

  }

}


