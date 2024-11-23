import { toast } from "react-hot-toast"
import { setLoading, setToken, setEmail } from "../../slices/authSlice"
import { resetCart } from "../../slices/cartSlice"
import { setUser } from "../../slices/profileSlice"
import { apiConnector } from "../apiConnector"
import { endpoints } from "../apis"

const {
  SENDOTP_API,
  SIGNUP_API,
  LOGIN_API,
  RESET_PASSWORD_EMAIL_API,
  RESET_PASSWORD_OTP_VERIFICATION_API,
  RESETPASSWORD_API,
  SEND_LOGIN_OTP_API,
  VERIFY_LOGIN_OTP_API
} = endpoints

export function sendOtp(email, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", SENDOTP_API, {
        email,
        checkUserPresent: true,
      })

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("OTP Sent Successfully")
      navigate("/verify-email")
    } catch (error) {
      toast.error("Could Not Send OTP")
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

export function signUp(
  accountType,
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  otp,
  navigate
) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", SIGNUP_API, {
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
      })


      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      toast.success("Signup Successful")
      navigate("/login")
    } catch (error) {
      toast.error("Signup Failed")
      navigate("/signup")
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

export function sendLoginOtp(email, navigate) {
  return async (dispatch) => {
    
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", SEND_LOGIN_OTP_API, {
        email,
      })

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("OTP Sent Successfully")
      navigate("/verify-login-otp")

    } catch (error) {
      toast.error("Could Not Send OTP")
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
    
  }
}

export function login(email, password, navigate) {
  return async (dispatch) => {

    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))

    try {
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
      })


      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      
      dispatch(setEmail(email))
      dispatch(sendLoginOtp(email,navigate))

    } catch (error) {
      toast.error("Login Failed")
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

export function verifyLoginOtp(email,otp,navigate){
  
  return async (dispatch) => {
      const toastId = toast.loading("Loading...")
      dispatch(setLoading(true))

      console.log(email, otp)
      
      try {
      const response = await apiConnector("POST",   VERIFY_LOGIN_OTP_API, {
        email,
        otp
      })

      if (!response.data.success) {
         throw new Error(response.data.message)
       }

       toast.success("Login Successful")
       dispatch(setToken(response.data.token))
       const userImage = response.data?.user?.image
        ? response.data.user.image
         : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`
       dispatch(setUser({ ...response.data.user, image: userImage }))
       localStorage.setItem("token", JSON.stringify(response.data.token))
       navigate("/dashboard/my-profile")
     
    } 
        catch (error) {
         toast.error("Login Failed")
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }

}

  

export function resetPasswordEmail(email, setEmailSent, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", RESET_PASSWORD_EMAIL_API, {
        email,
      })

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("Password Reset Email Sent")
      setEmailSent(true)
      navigate("/reset-password-otp-verification")

    } catch (error) {
      toast.error("The Email address provided does not matches our records")
    }
    toast.dismiss(toastId)
    dispatch(setLoading(false))
  }
}

export function resetPasswordOtpVerification(email, otp, navigate) {
  
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))

    console.log(email, otp)
    
    try {
    const response = await apiConnector("POST", RESET_PASSWORD_OTP_VERIFICATION_API , {
      email,
      otp
    })


    if (!response.data.success) {
       throw new Error(response.data.message)
    }

    navigate("/reset-password")
   
  } 
      catch (error) {
       toast.error("Error Failed")
  }
  dispatch(setLoading(false))
  toast.dismiss(toastId)
}

}

export function resetPassword(email, password, confirmPassword, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", RESETPASSWORD_API, {
        email,
        password,
        confirmPassword,
      })


      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("Password Reset Successfully")
      navigate("/login")
    } catch (error) {
      toast.error("Failed To Reset Password")
    }
    toast.dismiss(toastId)
    dispatch(setLoading(false))
  }
}

export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null))
    dispatch(setUser(null))
    dispatch(resetCart())
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    toast.success("Logged Out")
    navigate("/")
  }
}
