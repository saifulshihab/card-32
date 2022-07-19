import { userSignupValidator } from "@card-32/common/validators/userValidators";
import { Router } from "express";
import { signinUser, signupUser } from "../controller/userController";
import { inputValidator } from "../middlewares/inputValidator";

const router = Router();

// sign up
router.post("/signup", inputValidator(userSignupValidator), signupUser);
// sign in
router.post("/signin", inputValidator(userSignupValidator), signinUser);

export default router;
