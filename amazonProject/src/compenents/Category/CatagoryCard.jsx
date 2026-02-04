import React from "react";
import classes from "./category.module.css";
const CatagoryCard = ({ data }) => {
  return (
    <div className={classes.category}>
      <a href="">
        <span>
          <h1>{data.title}</h1>
        </span>
        <img src={data.imglink} alt={data.name} />
        <p>shop now</p>
      </a>
    </div>
  );
};
export default CatagoryCard;
