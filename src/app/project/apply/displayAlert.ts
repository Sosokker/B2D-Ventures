import Swal from "sweetalert2";
import toast from "react-hot-toast";

export const displayAlert = (error: any) => {
  Swal.fire({
    icon: error == null ? "success" : "error",
    title: error == null ? "Success" : `Error: ${error.code}`,
    text: error == null ? "Your application has been submitted" : error.message,
    confirmButtonColor: error == null ? "green" : "red",
    allowOutsideClick: false,
  }).then((result) => {
    if (result.isConfirmed) {
      if (error) {
        toast.error("Error sending Project Application");
      } else {
        toast.success("Your application has been submitted!");
      }
    }
  });
};
