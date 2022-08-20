import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { connectDatabase } from "./config/dbConnection";
import { PORT } from "./config/env";
import errorHandler, { routeNotFound } from "./middlewares/errorHandler";
import roomRouter from "./routes/roomRouter";
import userRouter from "./routes/userRouter";
import { mainNamespaceIO } from "./socket/mainSocket";
import { IServerToClientMainNamespaceEvents } from "./socket/events";
import { roomNamespaceIO } from "./socket/roomSocket";

dotenv.config();
require("express-async-errors");

const app = express();
export const httpServer = createServer(app);

const io = new Server<IServerToClientMainNamespaceEvents>(httpServer, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});

// database connection
connectDatabase();

process.on("unhandledRejection", (error) => {
  console.error(error);
});

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());

// APIs
app.use("/api/v1/user", userRouter);
app.use("/api/v1/room", roomRouter);

// error handler
app.use(routeNotFound);
app.use(errorHandler);

// invoke socket io
mainNamespaceIO(io);
roomNamespaceIO(io);

// listening server
httpServer.listen(PORT, () => {
  console.log(`Server running and up on port ${PORT} 🚀`);
});
