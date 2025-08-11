import express from "express";
import { Request, Response } from "express";
import { serve } from "inngest/express";
import { inngest } from "./inngest/index";
import { functions as inngestFunctions } from "./inngest/functions";
import { logger } from "./utils/logger";
import { connectDB } from "./utils/db";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler } from "./middlewares/errorHandler";
import authRouter from "./routes/auth";
import chatRouter from "./routes/chat";
import moodRouter from "./routes/mood";
import activityRouter from "./routes/activity";

dotenv.config(); //load environment variable from .env to process.env

const app = express(); //instantiate express app

// middlewares
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(morgan("dev")); // HTTP request logger

// Set up the "/api/inngest" (recommended) routes with the serve handler
app.use(
  "/api/inngest",
  serve({ client: inngest, functions: inngestFunctions })
);

app.use("/auth", authRouter);
app.use("/chat", chatRouter);
app.use("/api/mood", moodRouter);
app.use("/api/activity", activityRouter);

// Error handling middleware
app.use(errorHandler);

app.get("/", (req: Request, res: Response) => {
  res.send("hello world");
});
app.get("/api/chat", (req: Request, res: Response) => {
  res.send("hi how may i help you today?");
});

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDB();

    // Then start the server
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
      logger.info(
        `Inngest endpoint available at http://localhost:${PORT}/api/inngest`
      );
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
