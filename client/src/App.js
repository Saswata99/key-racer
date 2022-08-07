/* eslint-disable react-hooks/exhaustive-deps */
import { useState, createContext, useEffect } from "react";
import { InputBox, ProgressBar, TextArea, Timer } from "./components";
import io from "socket.io-client";
import { useNavigate, useParams } from "react-router-dom";

export const AppContext = createContext();
const socket = io.connect("https://key-racer-server.herokuapp.com");
//const socket = io.connect("http://localhost:5000");

function App() {
  const [wordsArray, setWordsArray] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [timer, setTimer] = useState(null);
  const [progressData, setProgressData] = useState(new Map());
  const [playerReady, setPlayerReady] = useState(false);
  const [gameReady, setGameReady] = useState(false);

  const navigate = useNavigate();
  const roomID = useParams().roomID;
  const socketID = socket.id;

  const joinRace = () => {
    socket.emit("join-race");
    setPlayerReady(true);
  };

  useEffect(() => {
    socket.emit("init", roomID);
    socket.on("redirect", (data) => navigate("/" + data));

    socket.on("words-array", (data) => {
      setWordsArray(data);
    });

    socket.on("progress-out", (playersData) =>
      setProgressData(new Map(playersData))
    );

    socket.on("start-game", () => {
      setGameReady((prev) => !prev);
      setCurrentIndex(0);
      setInputValue("");
    });

    socket.on("timer", (data) => setTimer(data));
  }, []);

  const handleInput = (event) => {
    if (!gameReady) return;

    const input = event.target.value;
    const currentWord = wordsArray[currentIndex] ?? "";

    if (input.length > currentWord.length) return;
    setInputValue(input);
    if (input !== currentWord) return;

    setInputValue("");
    setCurrentIndex((prev) => ++prev);

    socket.emit("progress-in", currentIndex + 1);
  };

  return (
    <AppContext.Provider
      value={{
        wordsArray,
        currentIndex,
        inputValue,
        progressData,
        timer,
        playerReady,
        gameReady,
        joinRace,
        handleInput,
        roomID,
        socketID,
      }}
    >
      <div className="App">
        <div className="body">
          <Timer />
          <ProgressBar />
          <div className="body-main">
            <TextArea />
            <InputBox />
          </div>
        </div>
      </div>
    </AppContext.Provider>
  );
}

export default App;
