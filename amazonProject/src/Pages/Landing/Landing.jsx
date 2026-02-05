import React from "react";
import Coursel from "../../compenents/Carousel/CarouselEfect.jsx";
import Prodact from "../../compenents/Prodact/Prodact.jsx";
import Category from "../../compenents/Category/Category.jsx";
import LoyOut from "../../compenents/LoyOut/LoyOut.jsx";

const Landing = () => {
  return (
    <div>
      <LoyOut>
        <Coursel />
        <Category />
        <Prodact />
      </LoyOut>
    </div>
  );
};
export default Landing;
