/**
 * Category.jsx - Category List Container
 *
 * Displays a grid/list of all product categories.
 * Each category is rendered as a clickable card that filters products by that category.
 * Maps through the categoryImage data array to render individual category cards.
 */

import React from "react";
import CatagoryCard from "./CatagoryCard.jsx";
import { categoryImage } from "./categoryFullInfos.js";
import classes from "./category.module.css";

const Category = () => {
  return (
    <div className={classes.category__container}>
      {/* Render a category card for each category in the data array */}
      {categoryImage.map((categoryInfo) => (
        <CatagoryCard data={categoryInfo} key={categoryInfo.name} />
      ))}
    </div>
  );
};

export default Category;
