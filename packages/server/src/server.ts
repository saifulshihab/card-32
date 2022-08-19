import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import { connectDatabase } from "./config/dbConnection";
import { PORT } from "./config/env";
import errorHandler from "./middlewares/errorHandler";
import userRouter from "./routes/userRouter";

dotenv.config();
require("express-async-errors");

const app = express();
export const httpServer = createServer(app);

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

// error handler
app.use(errorHandler);

// invoke socket events
require("./socket.ts");

// listening server
httpServer.listen(PORT, () => {
  console.log(`Server running and up on port ${PORT} 🚀`);
});
