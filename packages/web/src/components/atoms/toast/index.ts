import { toast, TypeOptions, ToastPosition } from "react-toastify";

interface IToastMessage {
  message: string;
  type?: TypeOptions;
  position?: ToastPosition;
}

export const showToastMessage = (props: IToastMessage) => {
  const { message, position, type } = props;
  toast(message, {
    position: position || "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    type: type || "info",
  });
};
