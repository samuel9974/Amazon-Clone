/**
 * LoyOut.jsx — Shared layout (Header + Outlet + Footer)
 *
 * Child routes render inside <Outlet /> (see App.jsx).
 */

import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../Header/Header.jsx";
import Footer from "../Footer/Footer.jsx";
import { CategoriesProvider } from "../Category/CategoriesProvider.jsx";

const LoyOut = () => {
  return (
    <CategoriesProvider>
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <main className="flex-grow-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </CategoriesProvider>
  );
};

export default LoyOut;
