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
import { CategoriesProvider } from "../Category/CategoriesProvider.jsx";

const LoyOut = ({ children }) => {
  return (
    <CategoriesProvider>
      <div>
        <Header />
        {children}
      </div>
    </CategoriesProvider>
  );
};

export default LoyOut;
