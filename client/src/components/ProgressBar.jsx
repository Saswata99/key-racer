import { useContext } from "react";
import { AppContext } from "../App";

function ProgressBar() {
  const { progressData } = useContext(AppContext);
  return (
    <div className="progressbar-area">
      {[...progressData].map(data => (
        <div key={data[0]} className="progressbar">
          <h6>{data[0]}</h6>
          <progress id="file" max="100" value={data[1]} />
        </div>
      ))}
    </div>
  );
}

export default ProgressBar;
