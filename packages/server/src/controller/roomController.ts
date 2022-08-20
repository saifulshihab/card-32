import { IPlayer } from "@card-32/common/types/player";
import { Request, Response } from "express";
import { sendUnauthorized } from "../middlewares/authenticator";
import { Room } from "../models/room";
import { emitNewRoomCreate } from "../socket/mainSocket";

// create room
export const createRoom = async (req: Request, res: Response) => {
  const { roomId } = req.body;

  if (!req.user) return sendUnauthorized(res);

  // user already created a room
  const room = await Room.findOne({ creator: req.user._id });
  if (room) {
    return res.status(400).json({
      message: `You already created a room - ${room.roomId}`,
    });
  }

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

  const newRoom = await Room.create({
    ...req.body,
    players,
    creator: req.user._id,
  });

  res.status(200).json(newRoom);

  return emitNewRoomCreate(newRoom);
};

// create room
export const deleteRoom = async (req: Request, res: Response) => {
  const { roomId } = req.params;

  if (!req.user) return sendUnauthorized(res);

  const room = await Room.findOne({ roomId });
  if (!room) {
    return res.status(404).json({
      message: `Room not found`,
    });
  }

  if (room.creator.toString() !== req.user._id.toString()) {
    return res
      .status(403)
      .json({ message: "You are not authorized to delete this room" });
  }

  await room.delete();

  return res.status(200).json(room);
};
