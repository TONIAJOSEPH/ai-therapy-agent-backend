import express from "express";
import { auth } from "../middlewares/auth";
import {
  logActivity,
  getAllActivities,
} from "../controllers/activityController";

const router = express.Router();

// All routes are protected with authentication
router.use(auth);

// Log a new activity
router.post("/", logActivity);

// get all activities
router.get("/", getAllActivities);

export default router;
