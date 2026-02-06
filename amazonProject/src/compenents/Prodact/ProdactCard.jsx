import React from "react";
import classes from "./prodact.module.css";
import Rating from "@mui/material/Rating";
import { Link } from "react-router-dom";

const ProdactCard = ({ product }) => {
  
  return (
    <div className={classes.card_container}>
      <Link to={`/products/${product.id}`}>
        <img src={product.image} alt={product.title} />
      </Link>
      <div className={classes.card_info}>
        <h3>{product.title}</h3>

        <div className={classes.rating}>
          <Rating value={product.rating.rate} precision={0.1} />
          <small>({product.rating.count})</small>
        </div>

        <div className={classes.card__price}>
          <p>${product.price}</p>
        </div>

        <div className={classes.button}>
          <button >Add to Cart</button>
        </div>
        
      </div>
    </div>
  );
};
export default ProdactCard;
