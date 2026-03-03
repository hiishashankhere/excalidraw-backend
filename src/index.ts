import http from "http";
import dotenv from "dotenv";
import app from "./app";
import { initSocket } from "./sockets/socket.server";
import { sequelize } from "./config/database";
import { initModels } from "./model";

dotenv.config();

const server = http.createServer(app);

initSocket(server);

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    initModels();
    await sequelize.authenticate().then(()=>{
      console.log("Database connection established successfully.");
    });
    await sequelize.sync({ alter: true });

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

void start();
