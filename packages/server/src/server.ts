import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { PORT } from "./config/env";
import { mainSocketIO } from "./socket/mainSocket";
import { logger } from "./utils/winston";

const app = express();
const httpServer = createServer(app);

(async () => {
  dotenv.config();

  const io = new Server(httpServer, {
    cors: {
      origin: ["http://localhost:3000"],
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
  mainSocketIO(io);

  // listening server
  httpServer.listen(PORT, () => {
    logger.info(`Server running and up on port ${PORT} 🚀`);
  });
})().catch((err) => logger.error(err));

process.on("unhandledRejection", (error) => {
  logger.error(error);
});
