import express from "express";
import cors from "cors";
// import authRoutes from "./routes/auth.routes";
// import roomRoutes from "./routes/room.routes";

const app = express();

app.use(cors());
app.use(express.json());


// app.use("/api/auth", authRoutes);
// app.use("/api/rooms", roomRoutes);

app.get("/", (req, res) => {
  res.send("server is up and running fine!!");
});

export default app;