import { MAIN_SOCKET_EVENTS } from "@card-32/common/constant/socket";
import jwt from "jsonwebtoken";
import { Namespace, Server, Socket } from "socket.io";
import { JWT_USER_SECRET } from "../config/env";
import { Room } from "../models/room";

let mainNamespace: Namespace;
const events = MAIN_SOCKET_EVENTS;

export const emitUpdatedRooms = async () => {
  const activeRooms = await Room.find({});
  mainNamespace.emit(events["ACTIVE::ROOMS"], { activeRooms });
};

export const mainNamespaceIO = (socketIO: Server) => {
  mainNamespace = socketIO.of("/");

  mainNamespace.use((socket, next) => {
    const { token } = socket.handshake.auth;

    if (!token) {
      return next(new Error("Not authorized! Token not found."));
    }
    const tokenVerified = jwt.verify(token, JWT_USER_SECRET);

    if (!tokenVerified) {
      return next(new Error("Not authorized! Token expired."));
    }

    return next();
  });

  mainNamespace.on("connection", async (socket: Socket) => {
    // send active rooms list on login
    await emitUpdatedRooms();

    // check if logged in user is in room or created a room
    const { playerId } = socket.handshake.query;

    const room = await Room.findOne({ creator: playerId });
    if (room) {
      socket.emit(events["CHECK::PLAYER"], { room });
    }
  });
};
