import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

console.log(
  `sometime server go offline 
  - open this https://key-racer-server.herokuapp.com
  - try again after 1 min`
);
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  //<React.StrictMode>
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}></Route>
      <Route path=":roomID" element={<App />}></Route>
      <Route
        path="*"
        element={
          <h4 style={{ color: "black" }}>
            worng room id:{" "}
            <Link style={{ color: "blue" }} to="/">
              create new room
            </Link>
          </h4>
        }
      ></Route>
    </Routes>
  </BrowserRouter>
  //</React.StrictMode>
);
