import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.scss";
import App from "./App.tsx";
import { FileContextProvider } from "./Contexts/FileContext.tsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <FileContextProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </FileContextProvider>
  </StrictMode>
);
