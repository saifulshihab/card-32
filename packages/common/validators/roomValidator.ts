import * as yup from "yup";
import { USERNAME_REGEX } from "../constant/regex";

export const createRoomSchema = yup.object().shape({
  roomId: yup
    .string()
    .min(5, "Room ID must be at least 5 characters")
    .max(15)
    .matches(
      USERNAME_REGEX,
      "Invalid room ID. Room ID can't contain special characters"
    )
    .required("Room ID is required"),
});
