import {
  changePasswordValidator,
  userEmailValidator,
  userProfileUpdateValidator,
  userSignupValidator,
  userUsernameValidator,
} from "@card-32/common/validators/userValidators";
import { Router } from "express";
import {
  changePassword,
  checkAuth,
  checkEmail,
  checkUsername,
  deleteAccount,
  getUserProfile,
  loginUser,
  signupUser,
  updateUserProfile,
} from "../controller/userController";
import { authenticator } from "../middlewares/authenticator";
import { inputValidator } from "../middlewares/inputValidator";

const router = Router();

// sign up
router.route("/signup").post(inputValidator(userSignupValidator), signupUser);
// login
router.route("/login").post(inputValidator(userSignupValidator), loginUser);
// auth check
router.route("/auth").get(authenticator(), checkAuth);
// check username
router
  .route("/profile/check/username")
  .get(
    authenticator(),
    inputValidator(null, null, userUsernameValidator),
    checkUsername
  );
// check email
router
  .route("/profile/check/email")
  .get(
    authenticator(),
    inputValidator(null, null, userEmailValidator),
    checkEmail
  );
// change username & email

router
  .route("/:userId")
  .get(authenticator(), getUserProfile)
  .put(
    authenticator(),
    inputValidator(userProfileUpdateValidator),
    updateUserProfile
  )
  .delete(authenticator(), deleteAccount);
// change password
router
  .route("/:userId/change/password")
  .put(
    authenticator(),
    inputValidator(changePasswordValidator),
    changePassword
  );

export default router;
