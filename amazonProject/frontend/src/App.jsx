/**
 * App.jsx - Main Application Component
 *
 * The root component of the application.
 * Currently serves as a wrapper for the routing component.
 * All pages and routes are handled through the Routering component.
 */

import { useState } from "react";
import Routering from "./Routering.jsx";

function App() {
  return (
    <>
      {/* All routing logic is handled in the Routering component */}
      <Routering />
    </>
  );
}
export default App;
