import { toast } from "react-hot-toast"
import { resetCart } from "../../slices/cartSlice"
import { apiConnector } from "../apiConnector"
import { studentEndpoints } from "../apis"

const {
  ENROLL_STUDENTS_API
} = studentEndpoints



// Buy the Course
export async function BuyCourse(
  token,
  courses,
  user,
  navigate,
  dispatch
) {
  const toastId = toast.loading("Loading...")
  try {

    const orderResponse = await apiConnector(
      "POST",
      ENROLL_STUDENTS_API,
      {
        courses,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    )

    if (!orderResponse.data.success) {
      throw new Error(orderResponse.data.message)
    }
    
    else{
      dispatch(resetCart())
      toast.success("You are Added to the course")
      navigate("/dashboard/enrolled-courses")
    }
    
}
     catch(error){
        toast.error(error.message) 
     }

    toast.dismiss(toastId)
}
