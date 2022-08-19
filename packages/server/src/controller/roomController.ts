import { IPlayer } from "@card-32/common/types/player";
import { Request, Response } from "express";
import { sendUnauthorized } from "../middlewares/authenticator";
import { Room } from "../models/room";

// create room
export const createRoom = async (req: Request, res: Response) => {
  const { roomId } = req.body;

  if (!req.user) return sendUnauthorized(res);

  const roomWithRoomIdExist = await Room.findOne({ roomId });
  if (roomWithRoomIdExist) {
    return res.status(400).json({
      message: "This room ID is used",
    });
  }

  const players: IPlayer[] = [
    {
      playerId: req.user._id,
      username: req.user.username,
    },
  ];

  await Room.create({ roomId, players, creator: req.user._id });

  return res.status(200).json({ message: "Room created" });
};
