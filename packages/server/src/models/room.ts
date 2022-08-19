import { IPlayer } from "@card-32/common/types/player";
import mongoose, { ObjectId, Schema } from "mongoose";
import { User } from "./user";

interface IRoomDocument {
  roomId: string;
  password: string;
  players: IPlayer[];
  creator: ObjectId;
}

const RoomSchema = new Schema<IRoomDocument>(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    players: {
      type: [
        {
          playerId: { type: String },
          username: { type: String },
        },
      ],
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Room = mongoose.model<IRoomDocument>("room", RoomSchema);
