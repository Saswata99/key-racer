import React, { useContext } from "react";
import { AppContext } from "../App";

function Timer() {
  const { timer, roomID } = useContext(AppContext);
  return (
    <div className="top-area">
      <p className="room-id">Room: {roomID}</p>
      <p className="timer">{timer}</p>
    </div>
  );
}

export default Timer;
