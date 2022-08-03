import * as yup from "yup";
import { EMAIL_FORMAT_REGEX, USERNAME_REGEX } from "../constant/regex";

export const userUsernameValidator = {
  username: yup
    .string()
    .min(3, "Username must be at least 3 characters")
    .matches(
      USERNAME_REGEX,
      "Invalid username. Username can't contain special characters"
    )
    .required("Username is required"),
};

export const userSignupValidator = yup.object().shape({
  ...userUsernameValidator,
  password: yup
    .string()
    .min(4, "Password must be at least 4 characters")
    .required("Password is required"),
});

export const userEmailValidator = {
  email: yup.string().matches(EMAIL_FORMAT_REGEX, "Invalid email"),
};

export const userProfileUpdateValidator = yup.object().shape({
  ...userUsernameValidator,
  ...userEmailValidator,
});
