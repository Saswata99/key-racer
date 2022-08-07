import { useContext } from "react";
import { AppContext } from "../App";
import Car from "./Car";

function ProgressBar() {
  const { progressData, socketID } = useContext(AppContext);
  return (
    <div className="progressbar-area">
      {[...progressData].map((data) => {
        const { name, progress, color, wpm } = data[1];
        const padding = (progress / 100) * 80 + "%";
        return (
          <div key={name} className="progressbar">
            <div className="progressbar-main" style={{ paddingLeft: padding }}>
              <p
                className={
                  socketID === data[0]
                    ? "player-name current-player"
                    : "player-name"
                }
              >
                {name}
              </p>
              <Car color={color} />{" "}
            </div>
            <p className="progressbar-result">{wpm}</p>
          </div>
        );
      })}
    </div>
  );
}

export default ProgressBar;
