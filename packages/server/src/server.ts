/* istanbul ignore file */
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { ALLOWED_ORIGINS, NODE_ENV, PORT } from "./config/env";
import { IRoom } from "./models/Room";
import { socketIO } from "./socket";
import { logger } from "./utils/winston";

const app = express();
const server = createServer(app);

// initial database
const rooms: IRoom[] = [];

dotenv.config();

const io = new Server(server, {
  cors: {
    origin: ALLOWED_ORIGINS,
  },
});

// middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/PING", (_, res) => {
  res.send("PONG");
});

// sockets
socketIO(io);

// listening server
server.listen(PORT, () => {
  logger.info(`Server running and up on port ${PORT} 🚀`);

  if (NODE_ENV === "development") {
    setInterval(() => {
      // eslint-disable-next-line no-console
      console.table(
        rooms.map((room) => ({
          ...room,
          players: room.players.map((player) => player.username),
        }))
      );
    }, 5000);
  }
});

process.on("unhandledRejection", (error) => {
  logger.error("unhandledRejection error", error);
});

export { server, rooms };
