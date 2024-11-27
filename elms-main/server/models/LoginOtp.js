const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender"); // Make sure this file is correctly implemented
const bcrypt = require("bcrypt");

const LoginOtpSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	otp: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		expires: 60 * 5, // Automatically delete the document after 5 minutes
	},
});

// Function to send OTP email
async function sendVerificationEmail(email, otp) {
	try {
		// Send the OTP email
		const mailResponse = await mailSender(
			email,
			"Login OTP Verification",
			`Your OTP is ${otp}. It will expire in 5 minutes.`
		);
		console.log("OTP sent successfully: ", mailResponse.response);
	} catch (error) {
		console.error("Error sending OTP email: ", error);
		throw error; // Optionally rethrow or handle as needed
	}
}

// Pre-save hook to send email after saving the document
LoginOtpSchema.pre("save", async function (next) {
	if (this.isNew) {
		// Hash the OTP for security (optional)
		const hashedOtp = await bcrypt.hash(this.otp, 10);
		this.otp = hashedOtp;

		// Send the OTP email after saving
		await sendVerificationEmail(this.email, this.otp);
	}

	next();
});

const LoginOtp = mongoose.model("LoginOTP", LoginOtpSchema);

module.exports = LoginOtp;
