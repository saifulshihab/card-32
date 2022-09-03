import { ROOM_SOCKET_EVENTS } from "@card-32/common/constant/socket";
import jwt from "jsonwebtoken";
import { Namespace, Server, Socket } from "socket.io";
import { JWT_USER_SECRET } from "../config/env";
import { IRoomDocument, Room } from "../models/room";

let roomNamespace: Namespace;
export const events = ROOM_SOCKET_EVENTS;

export const roomNamespaceIO = (socketIO: Server) => {
  roomNamespace = socketIO.of("/room");

  roomNamespace.use(async (socket, next) => {
    const { token } = socket.handshake.auth;
    const { roomId, playerId } = socket.handshake.query;
    if (!token) {
      return next(new Error("Not authorized! Token not found."));
    }
    const tokenVerified = jwt.verify(token, JWT_USER_SECRET);
    if (!tokenVerified) {
      return next(new Error("Not authorized! Token expired."));
    }

    const room = await Room.findOne({
      roomId,
      $or: [
        {
          creator: playerId,
        },
        {
          players: {
            $elemMatch: { playerId },
          },
        },
      ],
    });

    if (!room) {
      return next(new Error("Not authorized! Invalid room access"));
    }

    // socket.roomId = roomId;
    // socket.playerId = playerId;

    return next();
  });

  roomNamespace.on("connection", async (socket: Socket) => {
    const { roomId } = socket.handshake.query;
    const room = await Room.findOne({ roomId });

    console.log(socket.rooms, "@@");

    if (room) {
      socket.emit(events["UPDATE::ROOM"], { room });
      socket.join(room.roomId);
    }

    socket.on(events["PLAYER::LEAVE"], async () => {
      if (!room) return;
      if (!roomId) return;

      socket.leave(roomId as string);
      roomNamespace.to(roomId).emit(events["UPDATE::ROOM"], { room });
    });
  });
};

// emit new player join
export const newPlayerJoin = (roomId: string, room: IRoomDocument) => {
  roomNamespace.to(roomId).emit(events["PLAYER::JOINED"], { room });
};
