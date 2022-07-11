import mongoose from "mongoose";

export async function connectDatabase() {
  try {
    const dbUrl = process.env.DB_URL || "";
    const connection = await mongoose.connect(dbUrl);
    console.log(`MongoDB connected on ${connection.connection.host}`);
  } catch (error) {
    console.error("DB connection error", error);
    process.exit(1);
  }
}
