import { ISignInOrUpInput } from "@card-32/common/types/user";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AUTH_JWT_EXP_TIME, JWT_USER_SECRET } from "../config/env";
import { User } from "../models/user";

// user signup
export const signupUser = async (req: Request, res: Response) => {
  const { username, password } = req.body as ISignInOrUpInput;

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

// user signin
export const signinUser = async (req: Request, res: Response) => {
  const { username, password } = req.body as ISignInOrUpInput;

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ message: "Invalid username" });
  }

  const passwordMatched = await bcrypt.compare(password, user.password);
  if (!passwordMatched) {
    return res.status(400).json({ message: "Invalid password" });
  }

  const tokenPayload = {
    userId: user._id,
    username: user.username,
  };

  const accessToken = jwt.sign(tokenPayload, JWT_USER_SECRET, {
    expiresIn: AUTH_JWT_EXP_TIME,
  });

  return res.json({
    user: tokenPayload,
    accessToken: `JWT ${accessToken}`,
  });
};
