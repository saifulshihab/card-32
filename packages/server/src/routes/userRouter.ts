import {
  userProfileUpdateValidator,
  userSignupValidator,
} from "@card-32/common/validators/userValidators";
import { Router } from "express";
import {
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
