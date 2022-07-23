import { userSignupValidator } from "@card-32/common/validators/userValidators";
import { Router } from "express";
import { loginUser, signupUser } from "../controller/userController";
import { inputValidator } from "../middlewares/inputValidator";

const router = Router();

// sign up
router.post("/signup", inputValidator(userSignupValidator), signupUser);
// login
router.post("/login", inputValidator(userSignupValidator), loginUser);

export default router;
