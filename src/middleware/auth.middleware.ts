import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../types/request";
import { verifyAuthToken } from "../utils/jwt";

export const requireAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Missing or invalid auth token" });
    }

    const token = authHeader.replace("Bearer ", "").trim();
    const payload = verifyAuthToken(token);

    req.user = {
      id: payload.userId,
      email: payload.email,
    };

    return next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
