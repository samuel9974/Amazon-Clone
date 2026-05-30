/**
 * Landing.jsx - Home Page / Landing Page
 */

import React from "react";
import Coursel from "../compenents/Carousel/CarouselEfect.jsx";
import Prodact from "../compenents/Prodact/Prodact.jsx";
import Category from "../compenents/Category/Category.jsx";

const Landing = () => {
  return (
    <>
      <Coursel />
      <Category />
      <Prodact />
    </>
  );
};

export default Landing;
