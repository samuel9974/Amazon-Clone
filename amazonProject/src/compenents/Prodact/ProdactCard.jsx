/**
 * ProdactCard.jsx - Individual Product Card Component
 *
 * Displays a single product as a card with:
 * - Product image (clickable - navigates to product detail page)
 * - Product title
 * - Product rating and review count
 * - Product price
 * - Add to cart button
 * - Optional: Product description (if renderDescription prop is true)
 *
 * Props:
 * - product: Product object with id, title, image, price, rating, description
 * - flex: Boolean - if true, displays full width product card layout
 * - renderDescription: Boolean - if true, shows full product description
 */

import React from "react";
import classes from "./prodact.module.css";
import Rating from "@mui/material/Rating";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { Types } from "../../Utility/actionType.js";
import { DataContext } from "../DataProvider/DataProvider.jsx";

const ProdactCard = ({ product, flex, renderDescription }) => {
  // Access global state and dispatch to manage cart items
  const [state, dispatch] = useContext(DataContext);

  /**
   * Handles adding product to cart
   * Dispatches an action to add the product to the basket
   */
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
      {/* Link to product detail page */}
      <Link to={`/products/${product.id}`}>
        <img src={product.image} alt={product.title} />
      </Link>

      <div className={classes.card_info}>
        {/* Product title */}
        <h3>{product.title}</h3>

        {/* Full product description (shown on detail page) */}
        {renderDescription && (
          <div style={{ maxWidth: "750px" }}>{product.description}</div>
        )}

        {/* Star rating and review count */}
        <div className={classes.rating}>
          <Rating value={product.rating.rate} precision={0.1} />
          <small>({product.rating.count})</small>
        </div>

        {/* Product price */}
        <div className={classes.card__price}>
          <p>${product.price}</p>
        </div>

        {/* Add to cart button */}
        <div className={classes.button} onClick={addToCart}>
          <button>Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default ProdactCard;
