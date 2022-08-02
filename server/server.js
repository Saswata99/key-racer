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

const nameArr = [
  "mango",
  "banana",
  "apple",
  "orange",
  "pineappple",
  "pumpkin",
  "avocado",
  "watermelon",
  "coconut",
  "cherry",
  "kiwi",
  "lemon",
  "peach",
];

const wordsArray = await fetchQuotes();
const playersData = new Map();

io.on("connection", (socket) => {
  console.log("--------------------------------------------");
  console.log(socket.id);

  let roomID;
  const name =
    nameArr.splice((Math.random() * nameArr.length) | 0, 1)[0] ?? "player"; //pop random ele  1.9 | 0 = 1
  playersData.set(name, 0);

  const brodcast = () => {
    io.in(roomID).emit("progress-update", [...playersData]);
  }

  socket.on("join-room", (data) => {
    roomID = data ? data.slice(0, 5) : uid(5);
    socket.join(roomID);
    socket.emit("redirect", roomID);
    console.log(playersData);
    brodcast();
    socket.emit("words-array", wordsArray);
  });

  socket.on("progress-in", (progress) => {
    playersData.set(name, progress);
    brodcast();
  });

  socket.on("disconnect", (data) => {
    console.log(data);
    playersData.delete(name);
    brodcast();
  });
});

server.listen(PORT, () => {
  console.log("===================================================");
  console.log("listening on port:", PORT);
});
