import { useContext } from "react";
import { AppContext } from "../App";
import Car from "./Car";

function ProgressBar() {
  const { progressData, socketID } = useContext(AppContext);
  // console.log(progressData);
  return (
    <div className="progressbar-area">
      {[...progressData].map((data) => {
        const { name, progress, color, wpm } = data[1];
        const progressPadding = (progress / 100) * 75 + "%";
        return (
          <div key={name} className="progressbar">
            <div
              className="progressbar-main"
              style={{ paddingLeft: progressPadding }}
            >
              <div className="player-name">
                {socketID === data[0] && <span>u&nbsp;</span>}
                {name}
              </div>
              <Car color={color} />{" "}
            </div>
            <div className="progressbar-result">{wpm}</div>
            {/* <hr color="" style={{ marginTop: "-15px" }} /> */}
          </div>
        );
      })}
    </div>
  );
}

export default ProgressBar;
