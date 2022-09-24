import * as yup from "yup";
import { USERNAME_REGEX } from "@card-32/common/constant/regex";

export const roomJoinValidationSchema = yup.object().shape({
  username: yup
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(6, "Username can not be greater than 6 characters")
    .matches(USERNAME_REGEX, "Username can't contain special characters")
    .required("Username is required"),
  roomId: yup
    .string()
    .min(5, "Username must be at least 5 characters")
    .max(8, "Username can not be greater than 8 characters")
    .matches(USERNAME_REGEX, "Room Id can't contain special characters")
    .required("Room Id is required"),
});
