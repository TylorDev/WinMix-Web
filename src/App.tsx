import { Route, Routes } from "react-router-dom";
import "./App.scss";

import Login from "./Pages/Login/Login";

import Register from "./Pages/Login/Register/Register";
import AudioVisualizer from "./Components/AudioVisualizer";
// import { useState } from "react";
import { useFileContext } from "./Contexts/FileContext";

function App() {
  const { list } = useFileContext();
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cadastro" element={<Register />} />
      </Routes>

      <AudioVisualizer claves={list} />
    </div>
  );
}

export default App;
