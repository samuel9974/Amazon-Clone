import React from "react";
import classes from "./category.module.css";
import { Link } from "react-router-dom";
const CatagoryCard = ({ data }) => {
  return (
    <div className={classes.category}>
      <Link to={`/category/${data.name}`}>
        <span>
          <h1>{data.title}</h1>
        </span>
        <img src={data.imglink} alt={data.name} />
        <p>shop now</p>
      </Link>
    </div>
  );
};
export default CatagoryCard;
