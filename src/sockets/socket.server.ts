import { Server } from "socket.io";
import { Server as HTTPServer } from "http";
import { registerRoomHandlers } from "./room.socket";

export const initSocket = (server: HTTPServer) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    registerRoomHandlers(io, socket);
  });
};