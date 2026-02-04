import React from "react";
import classes from "./prodact.module.css";
import Rating from "@mui/material/Rating";



const ProdactCard = ({ prodact }) => {
  
  return (
    <div className={classes.card_container}>
      <a href="">
        <img src={prodact.image} alt={prodact.title} />
      </a>
      <div className={classes.card_info}>
        <h3>{prodact.title}</h3>

        <div className={classes.rating}>
          <Rating value={prodact.rating.rate} precision={0.1} />
          <small>({prodact.rating.count})</small>
        </div>

        <div className={classes.card__price}>
          <p>${prodact.price}</p>
        </div>

        <div className={classes.button}>
          <button >Add to Cart</button>
        </div>
        
      </div>
    </div>
  );
};
;
export default ProdactCard;
