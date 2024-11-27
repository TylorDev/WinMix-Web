import { Route, Routes } from "react-router-dom";
import "./App.scss";

import Login from "./Pages/Login/Login";

import Register from "./Pages/Login/Register/Register";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/cadastro" element={<Register />} />
    </Routes>
  );
}

export default App;
