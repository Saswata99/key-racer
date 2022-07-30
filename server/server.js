import express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import fetchQuotes from "./api.js";
import { uid } from "uid";

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    method: ["GET", "POST"],
  },
});

io.of('/abc').on("connection", () => console.log('qwe'))

io.on("connection", async (socket) => {
  const roomID = uid(6);
  const wordsArray = await fetchQuotes();

  console.log("new", socket.id);
  socket. emit("init", roomID);
  socket.emit("words-array", wordsArray);
});

server.listen(PORT, () => {
  console.log( 'Server running at port:', PORT);
});
