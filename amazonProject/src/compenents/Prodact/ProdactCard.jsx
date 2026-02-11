import React from "react";
import classes from "./prodact.module.css";
import Rating from "@mui/material/Rating";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { Types } from "../../Utility/actionType.js";
import { DataContext } from "../DataProvider/DataProvider.jsx";

const ProdactCard = ({ product, flex, renderDescription }) => {
  const [state, dispatch] = useContext(DataContext);
  const addToCart = () => {
    dispatch({
      type: Types.ADD_TO_BASKET,
      item: product,
    });
  };

  return (
    <div
      className={`${classes.card_container} ${flex ? classes.product__flexed : ""}`}
    >
      <Link to={`/products/${product.id}`}>
        <img src={product.image} alt={product.title} />
      </Link>
      <div className={classes.card_info}>
        <h3>{product.title}</h3>
        {renderDescription && (
          <div style={{ maxWidth: "750px" }}>{product.description}</div>
        )}
        <div className={classes.rating}>
          <Rating value={product.rating.rate} precision={0.1} />
          <small>({product.rating.count})</small>
        </div>

        <div className={classes.card__price}>
          <p>${product.price}</p>
        </div>

        <div className={classes.button} onClick={addToCart}>
          <button>Add to Cart</button>
        </div>
      </div>
    </div>
  );
};
export default ProdactCard;
