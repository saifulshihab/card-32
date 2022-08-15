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
  email: yup
    .string()
    .nullable(true)
    .matches(EMAIL_FORMAT_REGEX, "Invalid email")
    .notRequired(),
};

export const userUsernameValidator = yup.object().shape({
  ...userUsernameValidatorSchema,
});

export const userEmailValidator = yup.object().shape({
  ...userEmailValidatorSchema,
});

export const userProfileUpdateValidator = yup.object().shape({
  ...userUsernameValidatorSchema,
  ...userEmailValidatorSchema,
});

export const changePasswordValidationSchema = {
  oldPassword: yup
    .string()
    .min(4, "Password must be at least 4 characters")
    .required("Password is required"),
  newPassword: yup
    .string()
    .min(4, "Password must be at least 4 characters")
    .required("Password is required"),
};

export const changePasswordValidator = yup.object().shape({
  ...changePasswordValidationSchema,
});
