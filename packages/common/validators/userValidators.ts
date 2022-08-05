import * as yup from "yup";
import { EMAIL_FORMAT_REGEX, USERNAME_REGEX } from "../constant/regex";

export const userUsernameValidatorSchema = {
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
  ...userUsernameValidatorSchema,
  password: yup
    .string()
    .min(4, "Password must be at least 4 characters")
    .required("Password is required"),
});

export const userEmailValidatorSchema = {
  email: yup.string().matches(EMAIL_FORMAT_REGEX, "Invalid email"),
};

export const userUsernameValidator = yup.object().shape({
  ...userUsernameValidatorSchema,
});

export const userEmailValidator = yup.object().shape({
  email: yup.string().required().matches(EMAIL_FORMAT_REGEX, "Invalid email"),
});

export const userProfileUpdateValidator = yup.object().shape({
  ...userUsernameValidatorSchema,
  ...userEmailValidatorSchema,
});
