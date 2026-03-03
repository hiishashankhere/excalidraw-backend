import { Router } from "express";
import { getMe, login, register } from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth.middleware";

const authRoutes = Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.get("/me", requireAuth, getMe);

export default authRoutes;
