import { ROOM_SOCKET_EVENTS } from "@card-32/common/constant/socket";
import jwt from "jsonwebtoken";
import { Namespace, Server, Socket } from "socket.io";
import { JWT_USER_SECRET } from "../config/env";

let roomNamespace: Namespace;
export const events = ROOM_SOCKET_EVENTS;

export const roomNamespaceIO = (socketIO: Server) => {
  roomNamespace = socketIO.of(/^\/\w+$/);

  roomNamespace.use((socket, next) => {
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

  roomNamespace.on("connection", async (socket: Socket) => {
    const workspace = socket.nsp;
    console.log(workspace.name);
  });
};
