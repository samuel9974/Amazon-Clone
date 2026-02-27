/**
 * LoyOut.jsx - Layout Wrapper Component
 *
 * A reusable layout wrapper that includes the header at the top.
 * Used by all page components to maintain consistent header across the application.
 * Wraps page content as children.
 *
 * Props:
 * - children: React components/elements to render inside the layout
 */

import React from "react";
import Header from "../Header/Header.jsx";

const LoyOut = ({ children }) => {
  return (
    <div>
      {/* Header navigation bar - displayed on every page */}
      <Header />
      {/* Page content rendered here */}
      {children}
    </div>
  );
};

export default LoyOut;
