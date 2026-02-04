import React from "react";
import CatagoryCard from "./CatagoryCard.jsx";

import { categoryImage } from "./categoryFullInfos.js";
import classes from "./category.module.css";

const Category = () => {
  return (
    <div className={classes.category__container}>
      {
        categoryImage.map((categoryInfo) => (
            <CatagoryCard  data={categoryInfo} />
        ))
      }
    </div>
  );
};

export default Category;
