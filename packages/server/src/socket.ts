import jwt from "jsonwebtoken";
import { Socket, Server } from "socket.io";
import { JWT_USER_SECRET } from "./config/env";
import { cards, roomPlayers } from "./database";
import { httpServer } from "./server";
import { generateCards } from "./utils/card";
import { getPlayer, removePlayer } from "./utils/player";

const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});

io.use((socket, next) => {
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

// on socket connection
io.on("connection", (socket: Socket) => {
  // generate cards
  socket.on("startGame", () => {
    const player = getPlayer(socket.id);
    if (player) {
      const { cards } = generateCards(player.roomId);
      io.to(player.roomId).emit("receiveCards", { cards });
    }
  });

  // player disconnect
  socket.on("disconnect", () => {
    const player = removePlayer(socket.id);
    if (player) {
      io.to(player.roomId).emit("roomPlayers", {
        roomId: player.roomId,
        players: roomPlayers(player.roomId),
      });
      cards.splice(0, cards.length);
      io.to(player.roomId).emit("receiveCards", { cards: [] });
    }
  });
});

// on socket connection error
io.engine.on("connection_error", (err: any) => {
  console.error("Socket connection error!");
  console.log(err.req);
  console.log(err.code);
  console.log(err.message);
  console.log(err.context);
});
