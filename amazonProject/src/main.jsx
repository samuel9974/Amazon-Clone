import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import DataProvider from "./compenents/DataProvider/DataProvider.jsx";
import { reducer, initialState } from "./Utility/reducer.js";
import App from "./App.jsx";
import "./../index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <DataProvider reducer={reducer} initialState={initialState}>
      <App />
    </DataProvider>
  </StrictMode>,
);
