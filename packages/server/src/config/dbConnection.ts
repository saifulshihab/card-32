import mongoose from "mongoose";
import { logger } from "../utils/winston";

export async function connectDatabase() {
  try {
    const dbUrl = process.env.DB_URL || "";
    const connection = await mongoose.connect(dbUrl);
    logger.info(`MongoDB connected on ${connection.connection.host}`);
  } catch (error) {
    logger.info("DB connection error", error);
    process.exit(1);
  }
}
