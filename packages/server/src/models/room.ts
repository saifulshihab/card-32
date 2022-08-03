import mongoose, { Schema } from "mongoose";
import { IRoom } from "@card-32/common/types/room";

const RoomSchema = new Schema<IRoom>(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
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
  },
  {
    timestamps: true,
  }
);

export const Room = mongoose.model<IRoom>("room", RoomSchema);
