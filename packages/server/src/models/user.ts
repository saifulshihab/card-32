import mongoose, { Schema } from "mongoose";
import { IUser } from "@card-32/common/types/user";

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    email: String,
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>("user", UserSchema);
