import { USERNAME_REGEX } from "@card-32/common/constant/regex";
import * as yup from "yup";
import { yupSchemaWrapper } from "./validatorHelper";

export const userSignupValidator = yupSchemaWrapper(
  yup.object().shape({
    username: yup
      .string()
      .min(3, "Username must be at least 3 characters")
      .matches(
        USERNAME_REGEX,
        "Invalid username. Username can't contain special characters"
      )
      .required("Username is required"),
    password: yup
      .string()
      .min(4, "Password must be at least 4 characters")
      .required("Password is required"),
  })
);
