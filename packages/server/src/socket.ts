/* eslint-disable no-console */
import { ILoginInput } from "@card-32/common/types";
import { Server } from "socket.io";
import { cards, roomPlayers } from "./database";
import { httpServer } from "./server";
import { generateCards } from "./utils/card";
import { getPlayer, getPlayerIntoRoom, removePlayer } from "./utils/player";

const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});

// io.engine.on("initial_headers", (headers: any, req: any) => {
//   console.log(headers, "= headers");
//   console.log(req, "= req");
// });

// on socket connection
io.on("connection", (socket) => {
  // login
  socket.on("login", (input: ILoginInput, callback) => {
    const { error, player } = getPlayerIntoRoom({
      playerId: socket.id,
      username: input.username,
      roomId: input.roomId,
    });

    if (error) {
      return callback(error, null);
    }
    if (!player) return callback("Something went wrong", null);

    socket.join(player.roomId);

    io.to(player.roomId).emit("roomData", {
      roomId: player.roomId,
      players: roomPlayers(player.roomId),
    });
    return callback(null, player);
  });

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
