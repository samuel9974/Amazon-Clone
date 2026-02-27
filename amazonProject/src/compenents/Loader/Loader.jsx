/**
 * Loader.jsx - Loading Spinner Component
 *
 * Displays a loading animation while data is being fetched.
 * Uses the FadeLoader animation from react-spinners library.
 * Shown while waiting for API responses (products, categories, etc.)
 */

import React from "react";
import { FadeLoader } from "react-spinners";

const Loader = () => {
  return (
    // Container for the loader - centered on the page
    <div
      style={{
        display: "flex",
        alignItems: "center", // Vertically center
        justifyContent: "center", // Horizontally center
        height: "50vh", // Takes up 50% of viewport height
      }}
    >
      {/* Fade loader animation in teal/turquoise color */}
      <FadeLoader color="#36d7b7" />
    </div>
  );
};

export default Loader;
