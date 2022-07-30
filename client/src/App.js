import { useState, createContext, useEffect } from "react";
import { InputBox, ProgressBar, TextArea, Timer } from "./components";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();
const ENDPOINT = "http://localhost:5000";

function App() {
  const [wordsArray, setWordsArray] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [gameState, setGameState] = useState("");
  const [time, setTime] = useState();

  const navigate = useNavigate()

  useEffect(() => {
    const socket = io.connect(ENDPOINT);
    socket.on("words-array", data => {
      setWordsArray(data)
    })
    
    socket.on("init", (roomID) => navigate(`/${roomID}`));











    setTime(Date.now());
  }, []);

  useEffect(() => {}, [currentIndex]);

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

  return (
    <AppContext.Provider
      value={{
        wordsArray,
        setWordsArray,
        currentIndex,
        setCurrentIndex,
        inputValue: inputValue,
        setInputValue,
        handleInput,
        calculateWPM,
      }}
    >
      <div className="App">
        <div className="main-body">
          <Timer />
          <ProgressBar />
          <TextArea />
          <InputBox />
        </div>
      </div>
    </AppContext.Provider>
  );
}

export default App;
