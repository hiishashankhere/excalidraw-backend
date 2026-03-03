import { Server, Socket } from "socket.io";

export const registerRoomHandlers = (
  io: Server,
  socket: Socket
) => {
  socket.on("join-room", (roomId: string) => {
    socket.join(roomId);
  });

  socket.on("draw", ({ roomId, data }) => {
    socket.to(roomId).emit("receive-draw", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
};