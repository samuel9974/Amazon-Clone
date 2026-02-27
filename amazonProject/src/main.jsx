/**
 * main.jsx - Application Entry Point
 *
 * This is the main entry point for the React application.
 * It initializes the React DOM and wraps the entire app with:
 * - DataProvider: Provides global state management (Context API + useReducer)
 * - StrictMode: Helps identify potential problems during development
 * - The main App component and all its child routes/components
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import DataProvider from "./compenents/DataProvider/DataProvider.jsx";
import { reducer, initialState } from "./Utility/reducer.js";
import App from "./App.jsx";
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
