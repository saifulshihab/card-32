import {
  userEmailValidator,
  userProfileUpdateValidator,
  userSignupValidator,
  userUsernameValidator,
} from "@card-32/common/validators/userValidators";
import { Router } from "express";
import {
  checkEmail,
  checkUsername,
  getUserProfile,
  loginUser,
  signupUser,
  updateUserProfile,
} from "../controller/userController";
import { authenticator } from "../middlewares/authenticator";
import { inputValidator } from "../middlewares/inputValidator";

const router = Router();

// sign up
router.post("/signup", inputValidator(userSignupValidator), signupUser);
// login
router.post("/login", inputValidator(userSignupValidator), loginUser);
// check username
router
  .route("/profile/check/username")
  .get(authenticator(), inputValidator(userUsernameValidator), checkUsername);
// check email
router
  .route("/profile/check/email")
  .get(authenticator(), inputValidator(userEmailValidator), checkEmail);
// change username & email
router
  .route("/:userId")
  .get(authenticator(), getUserProfile)
  .put(
    authenticator(),
    inputValidator(userProfileUpdateValidator),
    updateUserProfile
  );

export default router;
