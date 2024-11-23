import { useState } from "react";
import OtpInput from "react-otp-input";
import { useDispatch, useSelector} from "react-redux";
import { useNavigate } from "react-router-dom";
import { sendLoginOtp } from "../services/operations/authAPI";
import { Link } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { RxCountdownTimer } from "react-icons/rx";
import { resetPasswordOtpVerification } from "../services/operations/authAPI";

function ResetPasswordOtp() {
  const [otp, setOtp] = useState("");
  const email   = useSelector((state) => state.auth.email)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log('Email is', email)
  const handleVerifyAndSignup = (e) => {
    e.preventDefault();
    dispatch(resetPasswordOtpVerification(email,otp,navigate))
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] grid place-items-center">
        <div className="max-w-[500px] p-4 lg:p-8">
          <h1 className="text-richblack-5 font-semibold text-[1.875rem] leading-[2.375rem]">
          Enter Reset Password OTP
          </h1>
          <p className="text-[1.125rem] leading-[1.625rem] my-4 text-richblack-100">
            A verification code has been sent to you. Enter the code below
          </p>
          <form onSubmit={handleVerifyAndSignup}>
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderInput={(props) => (
                <input
                  {...props}
                  placeholder="-"
                  style={{
                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                  }}
                  className="w-[48px] lg:w-[60px] border-0 bg-richblack-800 rounded-[0.5rem] text-richblack-5 aspect-square text-center focus:border-0 focus:outline-2 focus:outline-yellow-50"
                />
              )}
              containerStyle={{
                justifyContent: "space-between",
                gap: "0 6px",
              }}
            />
            <button
              type="submit"
              className="w-full bg-yellow-50 py-[12px] px-[12px] rounded-[8px] mt-6 font-medium text-richblack-900"
            >
              Submit OTP
            </button>
          </form>
          <div className="mt-6 flex items-center justify-between">
            <Link to="/login">
              <p className="text-richblack-5 flex items-center gap-x-2">
                <BiArrowBack /> Back To Login
              </p>
            </Link>
            <button
              className="flex items-center text-blue-100 gap-x-2"
              onClick={() => dispatch(sendLoginOtp(email, navigate))}
            >
              <RxCountdownTimer />
              Resend it
            </button>
          </div>
        </div>
    </div>
  );
}

export default ResetPasswordOtp;
