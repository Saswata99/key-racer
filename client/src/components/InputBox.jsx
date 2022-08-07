import { useContext } from "react";
import { AppContext } from "../App";

function InputBox() {
  const { inputValue, handleInput, playerReady, joinRace } =
    useContext(AppContext);
  return (
    <div className="input-area">
      {playerReady ? (
        <input
          className="text-input"
          onChange={(e) => handleInput(e)}
          value={inputValue}
        />
      ) : (
        <input
          className="join-btn"
          type="button"
          value="Join Race"
          onClick={joinRace}
        />
      )}
    </div>
  );
}

export default InputBox;
