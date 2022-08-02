/* eslint-disable react-hooks/exhaustive-deps */
import { useState, createContext, useEffect, useRef } from "react";
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
  const [time, setTime] = useState(0);
  const [progressData, setProgressData] = useState(new Map());

  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    socket.emit("join-room", params.roomID);
    socket.on("redirect", (data) => navigate("/" + data));

    socket.on("words-array", (data) => {
      setWordsArray(data);
    });

    socket.on("progress-update", (playerData) =>
      setProgressData(new Map(playerData))
    );
    // setTime(Date.now());
  }, []);


  useEffect(() => {
    const temp = (currentIndex / wordsArray.length) * 100;
    const progress = isNaN(temp) ? 0 : temp;
    socket.emit("progress-in", progress);
  }, [currentIndex]);

  const handleInput = (event) => {
    const input = event.target.value;
    const currentWord = wordsArray[currentIndex] ?? "";

    if (input.length > currentWord.length) return;
    setInputValue(input);

    if (input === currentWord) {
      setInputValue("");
      setCurrentIndex((prev) => ++prev);
      console.log(calculateWPM());
    }
  };

  const calculateWPM = () => {
    const timeNow = Date.now();
    const timeDef = (timeNow - time) / 1000 / 60;
    const wordTyped =
      wordsArray
        .slice(0, currentIndex)
        .reduce((res, val) => res + val.length, 0) / 5;

    return Math.floor(wordTyped / timeDef);
  };
  console.log('render app');
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
        handleInput,
        calculateWPM,
      }}
    >
      <div className="App">
        <div className="main-body">
          {/* <Timer /> */}
          <ProgressBar />
          <TextArea />
          <InputBox />
        </div>
      </div>
    </AppContext.Provider>
  );
}

export default App;
