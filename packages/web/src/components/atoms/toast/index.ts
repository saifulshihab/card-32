import { toast, TypeOptions } from "react-toastify";

export const showToastMessage = (message: string, type?: TypeOptions) => {
  toast(message, {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    type: type || "default",
  });
};
