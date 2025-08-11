import mongoose from "mongoose";
import { logger } from "./logger";

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://toniajoseph2013:kZv885MsHGSExJ2b@ai-therapist-agent.xonvd4i.mongodb.net/?retryWrites=true&w=majority&appName=ai-therapist-agent";

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    logger.info("connected to mongodb atlas");
  } catch (error) {
    logger.error("mongodb connection error:", error);
    process.exit(1);
  }
};
