import {
  IProfileUpdateInput,
  ISignInOrUpInput,
} from "@card-32/common/types/user";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AUTH_JWT_EXP_TIME, JWT_USER_SECRET } from "../config/env";
import { User } from "../models/user";
import { ISignInTokenPayload } from "../types/token";

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

  await User.create({
    ...req.body,
    password: hashedPassword,
  });

  return res.status(201).json({ message: "Successfully registered. " });
};

// user sign in
export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body as ISignInOrUpInput;

  const user = await User.findOne({ username }).select("+password");
  if (!user) {
    return res.status(400).json({ message: "Invalid username" });
  }

  const passwordMatched = await bcrypt.compare(password, user.password);
  if (!passwordMatched) {
    return res.status(400).json({ message: "Invalid password" });
  }

  const tokenPayload: ISignInTokenPayload = {
    userId: user._id.toString(),
    username: user.username,
  };

  const accessToken = jwt.sign(tokenPayload, JWT_USER_SECRET, {
    expiresIn: AUTH_JWT_EXP_TIME,
  });

  return res.json({
    user: tokenPayload,
    accessToken,
  });
};

// get user profile
export const getUserProfile = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }
  return res.status(200).json(user);
};

// user profile update
export const updateUserProfile = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const { username, email } = req.body as IProfileUpdateInput;

  user.username = username;
  user.email = email;

  await user.save();

  return res.status(200).json(user);
};
