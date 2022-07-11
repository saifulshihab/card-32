import { ISignUpInput } from "@card-32/common/types/user";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { User } from "../models/user";

// user signup
export const signupUser = async (req: Request, res: Response) => {
  const { username, password } = req.body as ISignUpInput;

  // username exist
  const usernameExist = await User.findOne({ username });
  if (usernameExist) {
    return res.status(400).json({ message: "Username exist" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    ...req.body,
    password: hashedPassword,
  });

  return res.status(201).json(newUser);
};
