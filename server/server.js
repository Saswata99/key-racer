import { Server } from "socket.io";
import { uid } from "uid";
import express from "express";
import http from "http";
import cors from "cors";
import fetchQuotes from "./api.js";

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://key-racer.netlify.app"],
    method: ["GET", "POST"],
  },
});

const color = [
  "aqua",
  "blue",
  "fuchsia",
  "gray",
  "green",
  "lime",
  "maroon",
  "olive",
  "purple",
  "red",
  "silver",
  "teal",
  "white",
  "yellow",
];
const playersData = new Map();
const gameRunning = {};
const wordsArray = {};
const nameCounter = {};
const gameTimer = {};

function allFinish(roomID, playersData) {
  let result = true;
  playersData.forEach((value) => {
    if (value.roomID === roomID && value.progress != 100) {
      result = false;
      return;
    }
  });

  return result;
}

function calculateWPM(roomID, currentIndex){
  const wordTyped = wordsArray[roomID].slice(0, currentIndex);
  const letterTyped = wordTyped.reduce((res, val) => res + val.length, 0) / 5;
  const timeDiff = (Date.now() - gameTimer[roomID]) / 1000 / 60;

  return Math.ceil(letterTyped / timeDiff)
}

function startGame(roomID) {
  if (gameRunning[roomID]) return;
  const playerCount = [...playersData].filter(
    (el) => el[1].roomID === roomID
  ).length;
  if (playerCount < 2) return;

  gameRunning[roomID] = true;
  gameTimer[roomID] = Date.now();

  let countDownTime = 5;
  let raceTime = 90;

  const timer = setInterval(async () => {
    const memberCount = io.of("/").adapter.rooms.get(roomID);
    if (!memberCount) {
      clearInterval(timer);
      return;
    }

    if (countDownTime >= 0) {
      io.in(roomID).emit("timer", countDownTime--);
      if (!countDownTime) io.in(roomID).emit("start-game");
      return;
    }
    
    if (raceTime >= 0 && !allFinish(roomID, playersData)) {
      io.in(roomID).emit("timer", raceTime--);
      return;
    }

    clearInterval(timer);
    wordsArray[roomID] = await fetchQuotes();
    io.in(roomID).emit("words-array", wordsArray[roomID]);
    io.in(roomID).emit("start-game");
    playersData.forEach((value, key) => {
      if (value.roomID === roomID) {
        playersData.set(key, { ...value, progress: 0, wpm: 0 });
      }
    });
    brodcast(roomID);
    gameRunning[roomID] = false;
    startGame(roomID);
  }, 1000);
}

function brodcast(roomID, socket) {
  const playesThisRoom = io.of("/").adapter.rooms.get(roomID);
  const playersDataThisRoom = [...playersData].filter((data) =>
    playesThisRoom.has(data[0])
  );
  if (socket) {
    socket.emit("progress-out", playersDataThisRoom);
    return;
  }
  io.in(roomID).emit("progress-out", playersDataThisRoom);
}

io.on("connection", (socket) => {
  console.log(socket.id, "--- join");

  let roomID;

  socket.on("init", async (data) => {
    roomID = data ? data.slice(0, 5) : uid(5);
    socket.join(roomID);
    socket.emit("redirect", roomID);
    if (!wordsArray[roomID]) wordsArray[roomID] = await fetchQuotes();
    if (!nameCounter[roomID]) nameCounter[roomID] = 0;
    socket.emit("words-array", wordsArray[roomID]);
    brodcast(roomID, socket);
  });

  socket.on("join-race", () => {
    playersData.set(socket.id, {
      name: String(++nameCounter[roomID]),
      roomID,
      color: color[(Math.random() * color.length) | 0],
      progress: 0,
      wpm: 0,
    });
    brodcast(roomID);
    startGame(roomID);
  });

  socket.on("progress-in", (currentIndex) => {
    playersData.set(socket.id, {
      ...playersData.get(socket.id),
      progress: (currentIndex / wordsArray[roomID].length) * 100,
      wpm: calculateWPM(roomID, currentIndex)
    });
    brodcast(roomID);
  });

  socket.on("disconnect", () => {
    console.log(socket.id, "--- leave");

    playersData.delete(socket.id);
    if (!io.of("/").adapter.rooms.get(roomID)) {
      console.log("Room:", roomID, "close");
      delete gameRunning[roomID];
      delete wordsArray[roomID];
      delete nameCounter[roomID];
      return;
    }
    brodcast(roomID);
  });
});

server.listen(PORT, () => {
  console.log("===================================================");
  console.log("listening on port:", PORT);
});
