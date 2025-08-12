import { Request, Response, NextFunction } from "express";
import { Activity, IActivity } from "../models/activity";
import { logger } from "../utils/logger";
import { sendActivityCompletionEvent } from "../utils/inngestEvents";

// Log a new activity
export const logActivity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { type, name, description, duration, difficulty, feedback } =
      req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const activity = new Activity({
      userId,
      type,
      name,
      description,
      duration,
      difficulty,
      feedback,
      timestamp: new Date(),
    });

    await activity.save();
    logger.info(`Activity logged for user ${userId}`);

    // Send activity completion event to Inngest
    await sendActivityCompletionEvent({
      userId,
      id: activity._id,
      type,
      name,
      duration,
      difficulty,
      feedback,
      timestamp: activity.timestamp,
    });

    res.status(201).json({
      success: true,
      data: activity,
    });
  } catch (error) {
    next(error);
  }
};

//get all activities
export const getAllActivities = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const activityData = await Activity.find({ userId: userId });
    logger.info(`Activity find for user ${userId}`);

    // Send activity completion event to Inngest

    res.status(201).json({
      success: true,
      data: activityData,
    });
  } catch (error) {
    next(error);
  }
};
