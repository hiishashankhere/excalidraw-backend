import { Router } from "express";
import {
  createRoom,
  getRoomState,
  joinRoom,
  listRooms,
  saveSnapshot,
} from "../controllers/room.controller";
import { requireAuth } from "../middleware/auth.middleware";

const roomRoutes = Router();

roomRoutes.get("/", listRooms);
roomRoutes.post("/", requireAuth, createRoom);
roomRoutes.get("/:roomId/state", getRoomState);
roomRoutes.post("/:roomId/join", joinRoom);
roomRoutes.put("/:roomId/snapshot", requireAuth, saveSnapshot);

export default roomRoutes;
