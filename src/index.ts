import http from "http";
import app from "./app";
import { initSocket } from "./sockets/socket.server";
import { sequelize } from "./config/database";

const server = http.createServer(app);

initSocket(server);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  sequelize.authenticate().then(() => {
    console.log("Database connected");
  });
  console.log(`Server running on port ${PORT}`);
});