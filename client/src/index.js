import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

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
          <h4>
            worng room id: <Link to="/">create new room</Link>
          </h4>
        }
      ></Route>
    </Routes>
  </BrowserRouter>
  //</React.StrictMode>
);
