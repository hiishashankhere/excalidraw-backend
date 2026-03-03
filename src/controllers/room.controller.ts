import { Request, Response } from "express";
import { BoardSnapshot, Room, RoomParticipant } from "../model";
import { AuthenticatedRequest } from "../types/request";

export const createRoom = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { name, isPrivate } = req.body as {
      name?: string;
      isPrivate?: boolean;
    };

    if (!name) {
      return res.status(400).json({ message: "Room name is required" });
    }

    const room = await Room.create({
      name,
      ownerId: req.user.id,
      isPrivate: Boolean(isPrivate),
    });

    await BoardSnapshot.create({
      roomId: room.id,
      elements: [],
      appState: null,
      updatedBy: req.user.id,
    });

    return res.status(201).json({
      message: "Room created",
      room,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create room" });
  }
};

export const listRooms = async (req: Request, res: Response) => {
  try {
    const rooms = await Room.findAll({
      order: [["createdAt", "DESC"]],
    });
    return res.status(200).json({ rooms });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch rooms" });
  }
};

export const joinRoom = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const roomId = req.params.roomId;
    if (!roomId || typeof roomId !== "string") {
      return res.status(400).json({ message: "Invalid room id" });
    }
    const { displayName, socketId } = req.body as {
      displayName?: string;
      socketId?: string;
    };

    const room = await Room.findByPk(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (!displayName || !socketId) {
      return res
        .status(400)
        .json({ message: "displayName and socketId are required" });
    }

    // Keep join idempotent for repeated client joins (e.g. React StrictMode in dev).
    await RoomParticipant.destroy({ where: { socketId } });

    const participant = await RoomParticipant.create({
      roomId,
      userId: req.user?.id ?? null,
      displayName,
      socketId,
      role: req.user?.id === room.ownerId ? "owner" : "editor",
      lastSeenAt: new Date(),
    });

    return res.status(200).json({
      message: "Joined room",
      participant,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to join room" });
  }
};

export const getRoomState = async (req: Request, res: Response) => {
  try {
    const roomId = req.params.roomId;
    if (!roomId || typeof roomId !== "string") {
      return res.status(400).json({ message: "Invalid room id" });
    }
    const room = await Room.findByPk(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const [snapshot, participants] = await Promise.all([
      BoardSnapshot.findOne({ where: { roomId } }),
      RoomParticipant.findAll({
        where: { roomId },
        order: [["updatedAt", "DESC"]],
      }),
    ]);

    return res.status(200).json({
      room,
      snapshot,
      participants: participants.map((participant) => ({
        id: participant.id,
        userId: participant.userId,
        displayName: participant.displayName,
        role: participant.role,
      })),
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch room state" });
  }
};

export const saveSnapshot = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const roomId = req.params.roomId;
    if (!roomId || typeof roomId !== "string") {
      return res.status(400).json({ message: "Invalid room id" });
    }
    const { elements, appState } = req.body as {
      elements?: object[];
      appState?: object | null;
    };

    if (!Array.isArray(elements)) {
      return res.status(400).json({ message: "elements must be an array" });
    }

    const [snapshot] = await BoardSnapshot.upsert(
      {
        roomId,
        elements,
        appState: appState ?? null,
        updatedBy: req.user?.id ?? null,
      },
      { returning: true }
    );

    return res.status(200).json({
      message: "Snapshot saved",
      snapshot,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to save snapshot" });
  }
};
