/* eslint-disable react-hooks/exhaustive-deps */
import { useState, createContext, useEffect } from "react";
import { InputBox, ProgressBar, TextArea, Timer } from "./components";
import io from "socket.io-client";
import { useNavigate, useParams } from "react-router-dom";

export const AppContext = createContext();
const socket = io.connect("http://localhost:5000");

function App(props) {
  const [wordsArray, setWordsArray] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [gameState, setGameState] = useState("");
  const [timeRPM, setTimeRPM] = useState(null);
  const [timeGame, setTimeGame] = useState(0);
  const [progressData, setProgressData] = useState(new Map());
  const [playerReady, setPlayerReady] = useState(false);

  const navigate = useNavigate();
  const params = useParams();

  const joinRace = () => {
    socket.emit("join-race");
    setPlayerReady(true);
  };

  useEffect(() => {
    socket.emit("init", params.roomID);
    socket.on("redirect", (data) => navigate("/" + data));

    socket.on("words-array", (data) => {
      setWordsArray(data);
    });

    socket.on("progress-out", (playersData) =>
      setProgressData(new Map(playersData))
    );

    socket.on("timer", (data) => setTimeGame(data));
  }, []);

  useEffect(() => {}, [gameState]);

  useEffect(() => {
    const temp = (currentIndex / wordsArray.length) * 100;
    const progress = isNaN(temp) ? 0 : temp;
    socket.emit("progress-in", { progress, wpm: calculateWPM() });
  }, [currentIndex]);

  const handleInput = (event) => {
    if (timeRPM === null) setTimeRPM(Date.now());
    const input = event.target.value;
    const currentWord = wordsArray[currentIndex] ?? "";

    if (input.length > currentWord.length) return;
    setInputValue(input);

    if (input === currentWord) {
      setInputValue("");
      setCurrentIndex((prev) => ++prev);
    }
  };

  const calculateWPM = () => {
    const timeNow = Date.now();
    const timeDef = (timeNow - timeRPM) / 1000 / 60;
    const wordTyped =
      wordsArray
        .slice(0, currentIndex)
        .reduce((res, val) => res + val.length - 1, 0) / 5; // -1 for remove space
    return Math.floor(wordTyped / timeDef);
  };

  return (
    <AppContext.Provider
      value={{
        wordsArray,
        setWordsArray,
        currentIndex,
        setCurrentIndex,
        inputValue,
        setInputValue,
        progressData,
        setProgressData,
        timeGame,
        setTimeGame,
        playerReady,
        joinRace,
        handleInput,
        socketID: socket.id,
      }}
    >
      <div className="App">
        <div className="body-main">
          <div className="body-top">
            <Timer />
            <ProgressBar />
          </div>
          <div className="body-buttom">
            <TextArea />
            <InputBox />
          </div>
        </div>
      </div>
    </AppContext.Provider>
  );
}

export default App;
