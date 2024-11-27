const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");

const OTPSchema = new mongoose.Schema({
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
		expires: 60 * 5, // OTP expires after 5 minutes
	},
});

// Function to send the OTP email
async function sendVerificationEmail(email, otp) {
	try {
		const mailResponse = await mailSender(
			email,
			"Verification Email",
			`Your OTP for email verification is ${otp}. It will expire in 5 minutes.`
		);
		console.log("Email sent successfully: ", mailResponse.response);
	} catch (error) {
		console.error("Error occurred while sending email: ", error);
		throw error; // Rethrow or handle the error as needed
	}
}

// Pre-save hook to hash OTP and send verification email
OTPSchema.pre("save", async function (next) {
	if (this.isNew) {
		// Hash the OTP before saving it (for security reasons)
		const hashedOtp = await bcrypt.hash(this.otp, 10);
		this.otp = hashedOtp;

		// Send the OTP email after the document has been saved
		await sendVerificationEmail(this.email, this.otp);
	}

	next();
});

const OTP = mongoose.model("OTP", OTPSchema);

module.exports = OTP;
