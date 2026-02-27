/**
 * Landing.jsx - Home Page / Landing Page
 *
 * The main landing page of the application.
 * Displays:
 * - Carousel/banner with promotional images
 * - Product categories (clickable cards)
 * - Featured/all products from the store
 *
 * This is the first page users see when visiting the application.
 */

import React from "react";
import Coursel from "../../compenents/Carousel/CarouselEfect.jsx";
import Prodact from "../../compenents/Prodact/Prodact.jsx";
import Category from "../../compenents/Category/Category.jsx";
import LoyOut from "../../compenents/LoyOut/LoyOut.jsx";

const Landing = () => {
  return (
    <div>
      <LoyOut>
        {/* Carousel banner at the top */}
        <Coursel />
        {/* Category cards section */}
        <Category />
        {/* All products section */}
        <Prodact />
      </LoyOut>
    </div>
  );
};

export default Landing;
