/**
 * Routering.jsx - Application Router Configuration
 *
 * Defines all routes and page navigation for the application.
 * Uses React Router (BrowserRouter) to handle client-side routing.
 *
 * Routes:
 * - /: Landing page (home with carousel, categories, products)
 * - /cart: Shopping cart page
 * - /orders: User orders history
 * - /payment: Payment page
 * - /results: Search results (filtered by category)
 * - /signup: Sign up / Authentication page
 * - /category/:categoryName: Products by category
 * - /products/:productId: Detailed product information
 */

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./Pages/Landing/Landing";
import Cart from "./Pages/Cart/Cart";
import Orders from "./Pages/Orders/Orders";
import Payment from "./Pages/Payment/Payment";
import ProductDetail from "./Pages/ProductDetail/ProductDetail";
import Results from "./Pages/Results/Results";
import Signup from "./Pages/Auth/Signup";

const Routering = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/payment" element={<Payment />} />
        {/* <Route path="/product" element={<ProductDetail />} /> */}
        <Route path="/results" element={<Results />} />
        <Route path="/signup" element={<Signup />} />
        {/* Dynamic route for category-based product filtering */}
        <Route path="/category/:categoryName" element={<Results />} />
        {/* Dynamic route for individual product details */}
        <Route path="/products/:productId" element={<ProductDetail />} />
      </Routes>
    </BrowserRouter>
  );
};
export default Routering;
