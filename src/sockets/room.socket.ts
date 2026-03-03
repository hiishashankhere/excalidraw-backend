import { Server, Socket } from "socket.io";
import { BoardSnapshot, Room, RoomParticipant } from "../model";

interface JoinRoomPayload {
  roomId: string;
  userId?: number;
  displayName?: string;
}

interface DrawPayload {
  roomId: string;
  elements: object[];
  appState?: object | null;
}

interface CursorPayload {
  roomId: string;
  x: number;
  y: number;
}

export const registerRoomHandlers = (
  io: Server,
  socket: Socket
) => {
  socket.on("join-room", async (payload: JoinRoomPayload) => {
    const { roomId, userId, displayName } = payload;
    if (!roomId) return;

    const room = await Room.findByPk(roomId);
    if (!room) {
      socket.emit("room-error", { message: "Room not found" });
      return;
    }

    socket.join(roomId);

    const participant = await RoomParticipant.create({
      roomId,
      userId: userId ?? null,
      socketId: socket.id,
      displayName: displayName ?? "Guest",
      role: userId === room.ownerId ? "owner" : "editor",
      lastSeenAt: new Date(),
    });

    const snapshot = await BoardSnapshot.findOne({ where: { roomId } });

    socket.emit("room-state", {
      roomId,
      snapshot,
      participant: {
        id: participant.id,
        displayName: participant.displayName,
        role: participant.role,
      },
    });

    socket.to(roomId).emit("user-joined", {
      roomId,
      socketId: socket.id,
      displayName: participant.displayName,
    });
  });

  socket.on("draw", async (payload: DrawPayload) => {
    const { roomId, elements, appState } = payload;
    if (!roomId || !Array.isArray(elements)) return;

    await BoardSnapshot.upsert({
      roomId,
      elements,
      appState: appState ?? null,
      updatedBy: null,
    });

    socket.to(roomId).emit("receive-draw", {
      roomId,
      elements,
      appState: appState ?? null,
    });
  });

  socket.on("cursor-move", (payload: CursorPayload) => {
    if (!payload.roomId) return;
    socket.to(payload.roomId).emit("receive-cursor", {
      socketId: socket.id,
      x: payload.x,
      y: payload.y,
    });
  });

  socket.on("leave-room", async (roomId: string) => {
    if (!roomId) return;
    socket.leave(roomId);
    await RoomParticipant.destroy({ where: { roomId, socketId: socket.id } });
    socket.to(roomId).emit("user-left", { roomId, socketId: socket.id });
  });

  socket.on("disconnect", async () => {
    const memberships = await RoomParticipant.findAll({
      where: { socketId: socket.id },
    });
    await RoomParticipant.destroy({ where: { socketId: socket.id } });

    memberships.forEach((membership) => {
      socket.to(membership.roomId).emit("user-left", {
        roomId: membership.roomId,
        socketId: socket.id,
      });
    });

    console.log("User disconnected:", socket.id);
  });
};
