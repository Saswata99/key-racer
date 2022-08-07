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

let gameRunning = {};
const color = [
  "aqua",
  "black",
  "blue",
  "fuchsia",
  "gray",
  "green",
  "lime",
  "maroon",
  "navy",
  "olive",
  "purple",
  "red",
  "silver",
  "teal",
  "white",
  "yellow",
];
let nameCounter = 0;

const wordsArray = await fetchQuotes();
const playersData = new Map();

const startGame = async (roomID) => {
  if (gameRunning[roomID]) return;
  const playerCount = [...playersData].filter(
    (el) => el[1].roomID === roomID
  ).length;
  if (playerCount < 2) return;

  gameRunning[roomID] = true;
  const wordsArray = await fetchQuotes();

  let time = 3;
  const timmer = setInterval(() => {
    const memberCount = io.of("/").adapter.rooms.get(roomID);
    if (time <= 0 || !memberCount) clearInterval(timmer);
    io.in(roomID).emit("timer", time--);
  }, 1000);
};

const brodcast = (roomID, socket) => {
  const playesWithRoomID = io.of("/").adapter.rooms.get(roomID);
  if (playesWithRoomID) return;
  const playersDataWithRoomID = [...playersData].filter((data) =>
    playesWithRoomID.has(data[0])
  );
  if (socket) {
    socket.emit("progress-out", playersDataWithRoomID);
    return;
  }
  io.in(roomID).emit("progress-out", playersDataWithRoomID);
};

io.on("connection", (socket) => {
  console.log("--------------------------------------------");
  console.log(socket.id);

  let roomID;

  socket.on("init", (data) => {
    roomID = data ? data.slice(0, 5) : uid(5);
    socket.join(roomID);
    socket.emit("redirect", roomID);
    socket.emit("words-array", wordsArray);
    brodcast(roomID, socket);
  });

  socket.on("join-race", () => {
    playersData.set(socket.id, {
      name: String(++nameCounter),
      roomID,
      color: color[(Math.random() * color.length) | 0],
      progress: 0,
      wpm: 0,
    });
    brodcast(roomID);
    startGame(roomID);
  });

  socket.on("progress-in", (data) => {
    if (!playersData.has(socket.id)) return;
    playersData.set(socket.id, {
      ...playersData.get(socket.id),
      progress: data.progress,
      wpm: data.wpm,
    });
    brodcast(roomID);
  });

  // startGame(roomID);

  socket.on("disconnect", (data) => {
    playersData.delete(socket.id);
    brodcast(roomID);
  });
});

server.listen(PORT, () => {
  console.log("===================================================");
  console.log("listening on port:", PORT);
});
