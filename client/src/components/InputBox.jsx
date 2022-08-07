import { useContext } from "react";
import { AppContext } from "../App";

function InputBox() {
  const { inputValue, handleInput, playerReady, joinRace } =
    useContext(AppContext);
  console.log(inputValue);
  return (
    <div className="input-area">
      {playerReady ? (
        <input
          className="text-input"
          type="input"
          onChange={(e) => handleInput(e)}
          value={inputValue}
        />
      ) : (
        <input className="join-btn" type="submit" onClick={joinRace} />
      )}
    </div>
  );
}

export default InputBox;
