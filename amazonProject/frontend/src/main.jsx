import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import DataProvider from "./compenents/DataProvider/DataProvider.jsx";
import { reducer, initialState } from "./Utility/reducer.js";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "./../index.css";

// Render the app into the root DOM element
createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* DataProvider wraps the app to provide global state (basket, etc.) */}
    <DataProvider reducer={reducer} initialState={initialState}>
      <App />
    </DataProvider>
  </StrictMode>,
);
