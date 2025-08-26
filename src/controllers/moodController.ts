import { Request, Response, NextFunction } from "express";
import { Mood } from "../models/mood";
import { logger } from "../utils/logger";
import { sendMoodUpdateEvent } from "../utils/inngestEvents";
import { Types } from "mongoose";

// Create a new mood entry
export const createMood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { score, note, context, activities, insight } = req.body;
    const userId = req.user?._id; // From auth middleware

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const mood = new Mood({
      userId,
      score,
      note,
      context,
      activities,
      timestamp: new Date(),
    });

    await mood.save();
    logger.info(`Mood entry created for user ${userId}`);

    // Send mood update event to Inngest
    await sendMoodUpdateEvent({
      userId,
      mood: score,
      note,
      context: insight,
      activities,
      timestamp: mood.timestamp,
    });

    res.status(201).json({
      success: true,
      data: mood,
    });
  } catch (error) {
    next(error);
  }
};

//get mood
export const getMood = async (req: Request, res: Response) => {
  try {
    const userId = new Types.ObjectId(req.user?.id);

    // Find session by sessionId instead of _id
    const moodEntries = await Mood.find({ userId: userId });
    if (!moodEntries) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.json(moodEntries);
  } catch (error) {
    logger.error("Error fetching mood:", error);
    res.status(500).json({ message: "Error fetching mood" });
  }
};
