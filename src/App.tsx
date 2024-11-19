import { Route, Routes } from "react-router-dom";
import "./App.scss";

import Login from "./Pages/Login/Login";
import Visualizer from "./Components/Visualizer";
import Register from "./Pages/Login/Register/Register";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/register"
        element={<Register preset="$$$ Royal - Mashup (431)" />}
      />
      <Route
        path="/cadastro"
        element={<Register preset="cope + martin - mother-of-pearl" />}
      />
    </Routes>
  );
}

export default App;
