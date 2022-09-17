import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import { connectDatabase } from "./config/dbConnection";
import { PORT } from "./config/env";
import errorHandler, { routeNotFound } from "./middlewares/errorHandler";
import userRouter from "./routes/userRouter";
import { logger } from "./utils/winston";

require("express-async-errors");

const app = express();
const httpServer = createServer(app);

(async () => {
  dotenv.config();
  // database connection
  await connectDatabase();

  // middleware
  app.use(cors());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.get("/PING", (_, res) => {
    res.send("PONG");
  });

  // APIs
  app.use("/api/v1/user", userRouter);

  // error handler
  app.use(routeNotFound);
  app.use(errorHandler);

  // listening server
  httpServer.listen(PORT, () => {
    logger.info(`Server running and up on port ${PORT} 🚀`);
  });
})().catch((err) => logger.error(err));

process.on("unhandledRejection", (error) => {
  logger.error(error);
});
