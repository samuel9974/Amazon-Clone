/**
 * CarouselEfect.jsx - Image Carousel / Slider Component
 *
 * Displays an automatic scrolling image carousel/slider at the top of the landing page.
 * Features:
 * - Auto-playing images
 * - Infinite loop
 * - No manual controls (indicators and thumbnails hidden)
 * - Responsive design
 */

import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { carousel as img } from "./img/data.js";
import classes from "./carousel.module.css";

const CarouselEfect = () => {
  return (
    <>
      {/* Carousel component - displays promotional/featured images */}
      <Carousel
        autoPlay={true} // Auto-play images
        infiniteLoop={true} // Loop endlessly
        showIndicators={false} // Hide dot indicators
        showThumbs={false} // Hide thumbnail previews
      >
        {/* Render each image from the carousel data array */}
        {img.map((imageItemLink) => {
          return <img src={imageItemLink} />;
        })}
      </Carousel>
      {/* Overlay gradient effect on top of carousel */}
      <div className={classes.hero__img}></div>
    </>
  );
};

export default CarouselEfect;
