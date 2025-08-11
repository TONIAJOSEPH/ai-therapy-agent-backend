import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  console.log("in auth backend middleware", req.header);
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    console.log("in auth backend middleware request token", token);

    if (!token) {
      console.log("no token");
      return res.status(401).json({ message: "Authentication required" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    ) as any;
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    console.log("auth middleware req", req.user);
    next();
  } catch (error) {
    console.log("auth middleware error");
    res.status(401).json({ message: "Invalid authentication token" });
  }
};
