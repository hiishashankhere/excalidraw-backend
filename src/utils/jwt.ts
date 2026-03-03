import jwt from "jsonwebtoken";
import { AuthTokenPayload } from "../types/auth";

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }
  return secret;
};

export const signAuthToken = (payload: AuthTokenPayload) => {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "7d" });
};

export const verifyAuthToken = (token: string) => {
  return jwt.verify(token, getJwtSecret()) as AuthTokenPayload;
};
