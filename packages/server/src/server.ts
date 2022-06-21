import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const PORT = 5000;

const httpServer = createServer(app);

export const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});

require("./socket.ts");

httpServer.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port: ${PORT}`);
});
